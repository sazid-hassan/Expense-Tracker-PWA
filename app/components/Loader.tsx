'use client';

import { Box, CircularProgress, Skeleton, Typography, keyframes } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const dotAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'overlay' | 'inline';
export type LoaderSize = 'small' | 'medium' | 'large';

interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
  backgroundColor?: string;
}

const sizeMap = {
  small: { spinner: 20, text: 'body2' as const, spacing: 1 },
  medium: { spinner: 40, text: 'body1' as const, spacing: 2 },
  large: { spinner: 60, text: 'h6' as const, spacing: 3 },
};

export default function Loader({
  variant = 'spinner',
  size = 'medium',
  message,
  fullScreen = false,
  overlay = false,
  color = 'primary',
  backgroundColor,
}: LoaderProps) {
  const theme = useTheme();
  const { spinner: spinnerSize, text: textVariant, spacing } = sizeMap[size];

  const renderSpinner = () => (
    <CircularProgress 
      size={spinnerSize} 
      color={color}
      sx={{
        animation: `${pulseAnimation} 2s ease-in-out infinite`,
      }}
    />
  );

  const renderDots = () => (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: spinnerSize * 0.2,
            height: spinnerSize * 0.2,
            borderRadius: '50%',
            backgroundColor: theme.palette[color].main,
            animation: `${dotAnimation} 1.4s ease-in-out infinite both`,
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );

  const renderPulse = () => (
    <Box
      sx={{
        width: spinnerSize,
        height: spinnerSize,
        borderRadius: '50%',
        border: `4px solid ${theme.palette[color].main}`,
        animation: `${pulseAnimation} 2s ease-in-out infinite`,
      }}
    />
  );

  const renderSkeleton = () => (
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Skeleton variant="text" height={40} animation="wave" />
      <Skeleton variant="text" height={30} animation="wave" />
      <Skeleton variant="rectangular" height={60} animation="wave" sx={{ mt: 1 }} />
    </Box>
  );

  const renderInline = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={16} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  const getLoaderContent = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'inline':
        return renderInline();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing,
    animation: `${fadeInAnimation} 0.3s ease-out`,
    ...(fullScreen && {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: backgroundColor || theme.palette.background.default,
    }),
    ...(overlay && !fullScreen && {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      backgroundColor: backgroundColor || `${theme.palette.background.default}CC`,
      backdropFilter: 'blur(2px)',
    }),
    ...(variant === 'inline' && {
      flexDirection: 'row' as const,
      display: 'inline-flex',
    }),
  };

  return (
    <Box sx={containerStyles}>
      {variant !== 'inline' && getLoaderContent()}
      {variant === 'inline' && getLoaderContent()}
      {message && variant !== 'skeleton' && variant !== 'inline' && (
        <Typography 
          variant={textVariant} 
          color="text.secondary"
          sx={{
            textAlign: 'center',
            animation: `${fadeInAnimation} 0.5s ease-out 0.2s both`,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

// Convenience components for common use cases
export const FullScreenLoader = ({ message, ...props }: Omit<LoaderProps, 'fullScreen'>) => (
  <Loader {...props} fullScreen message={message} />
);

export const OverlayLoader = ({ message, ...props }: Omit<LoaderProps, 'overlay'>) => (
  <Loader {...props} overlay message={message} />
);

export const InlineLoader = ({ message, ...props }: Omit<LoaderProps, 'variant'>) => (
  <Loader {...props} variant="inline" message={message} />
);

export const SkeletonLoader = (props: Omit<LoaderProps, 'variant'>) => (
  <Loader {...props} variant="skeleton" />
);
