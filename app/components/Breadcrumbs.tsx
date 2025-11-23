'use client';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                style={{
                  textDecoration: 'none',
                }}
              >
                <Typography
                  sx={{
                    color: 'rgba(0, 122, 255, 0.9)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ) : (
              <Typography
                sx={{
                  color: isLast ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '14px',
                  fontWeight: isLast ? 600 : 500,
                }}
              >
                {item.label}
              </Typography>
            )}
            {!isLast && (
              <NavigateNextIcon
                sx={{
                  fontSize: '18px',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

