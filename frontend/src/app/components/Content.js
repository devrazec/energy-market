'use client';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

const BOTTOM_NAV_HEIGHT = 56;

const PAGES = [
  { title: 'Historical',    href: '/pages/Historical',     img: '/energy-market/pic3.jpg' },
  { title: 'Location',      href: '/pages/Location',       img: '/energy-market/pic4.jpg' },
  { title: 'Market Price',  href: '/pages/MarketPrice',    img: '/energy-market/pic5.jpg' },
  { title: 'Porto Weather', href: '/pages/PortoWeather',   img: '/energy-market/pic4.jpg' },
];

export default function Content({ children }) {
  const router = useRouter();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Toolbar sx={{ flexShrink: 0 }} />
      {children ? (
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          {children}
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            pb: { xs: `${BOTTOM_NAV_HEIGHT + 24}px`, md: 3 },
          }}
        >
          {/* <Typography variant="h5" gutterBottom fontWeight={600}>
            Dashboard
          </Typography> */}
          <Grid container spacing={3}>
            {PAGES.map(({ title, href, img }) => (
              <Grid key={href} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  elevation={2}
                  sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}
                  onClick={() => router.push(href)}
                >
                  <CardMedia
                    component="img"
                    image={img}
                    alt={title}
                    sx={{ height: 160, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, pb: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#00a76f1f' }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {title}
                    </Typography>
                  </CardContent>
                  {/* <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      disableElevation
                      sx={{ background: '#008bc1', '&:hover': { background: '#0073a4' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      onClick={(e) => { e.stopPropagation(); router.push(href); }}
                    >
                      More
                    </Button>
                  </CardActions> */}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

