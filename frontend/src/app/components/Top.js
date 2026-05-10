'use client';

import { useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import { usePathname } from 'next/navigation';


const SHORTCUTS = [
  { label: 'Tomorrow', getRange: () => { const d = new Date(); d.setDate(d.getDate() + 1); return { startDate: d, endDate: d }; }, route: '/pages/Tomorrow' },
  { label: 'Today', getRange: () => { const d = new Date(); return { startDate: d, endDate: d }; }, route: '/pages/Today' },
  { label: 'Yesterday', getRange: () => { const d = new Date(); d.setDate(d.getDate() - 1); return { startDate: d, endDate: d }; }, route: '/pages/Yesterday' },
  { label: 'Week', getRange: () => { const d = new Date(); const s = new Date(d); s.setDate(d.getDate() - d.getDay()); return { startDate: s, endDate: d }; }, route: '/pages/Week' },
  { label: 'Month', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), d.getMonth(), 1), endDate: d }; }, route: '/pages/Month' },
  
  { label: 'Grouped Day', getRange: () => { const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 7); return { startDate: s, endDate: e }; }, route: '/pages/GroupedDay' },
  { label: 'Grouped Month', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), 0, 1), endDate: d }; }, route: '/pages/GroupedMonth' },
  { label: 'Grouped Year', getRange: () => { const d = new Date(); return { startDate: new Date(d.getFullYear(), 0, 1), endDate: d }; }, route: '/pages/GroupedYear' },
  
  { label: 'One Day', getRange: () => { const d = new Date(); return { startDate: d, endDate: d }; }, route: '/pages/OneDay' },
  { label: 'One Month', getRange: () => { const e = new Date(); const s = new Date(); s.setDate(e.getDate() - 30); return { startDate: s, endDate: e }; }, route: '/pages/OneMonth' },
  { label: 'One Year', getRange: () => { const y = new Date().getFullYear() - 1; return { startDate: new Date(y, 0, 1), endDate: new Date(y, 11, 31) }; }, route: '/pages/OneYear' },
];

export default function Top() {
  const { darkMode, setDarkMode, mobileDevice, currentUrl, setCurrentUrl } = useContext(GlobalContext);
  const router = useRouter();
  const pathname = usePathname();
  const anchorRef = useRef(null);

  // Extract only the last part of the URL
  const getLastSegment = (url) => {
    if (url === '/') return '/';
    const segments = url.split('/').filter(Boolean);
    return segments[segments.length - 1];
  };
  
  const currentSegment = getLastSegment(pathname);
  useEffect(() => {
    setCurrentUrl(pathname);
  }, [pathname, setCurrentUrl]);

  const isHome = pathname === '/';
  const showBackArrow = !isHome && mobileDevice;

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }]);

  const handleShortcut = (shortcut) => {
    const { startDate, endDate } = shortcut.getRange();
    setRange([{ startDate, endDate, key: 'selection' }]);
    setOpen(false);
    router.push(shortcut.route);
  };

  const isOneDay = currentSegment === 'OneDay';
  const isSingleDay = isOneDay || currentSegment === 'Yesterday' || currentSegment === 'Tomorrow' || currentSegment === 'Today';
  const isMonthYearPage = currentSegment === 'OneMonth';
  const isYearPage = currentSegment === 'OneYear';



  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#00a76f1f',
        backdropFilter: 'blur(4px)',
        borderBottom: '1px solid', borderColor: 'divider',
      }}
    >
      <Toolbar>
        {mobileDevice ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Image src="/energy-market/logo1.png" alt="Logo" width={42} height={42} style={{ objectFit: 'contain' }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Image src="/energy-market/logo.png" alt="Logo" width={140} height={60} style={{ objectFit: 'contain' }} />
          </Box>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>

          <Popover
            open={open}
            anchorEl={anchorRef.current}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            PaperProps={{ sx: { maxWidth: mobileDevice ? '100vw' : 'none', width: mobileDevice ? '100vw' : 'auto' } }}
          >
            <Paper sx={{ display: 'flex', flexDirection: mobileDevice ? 'column' : 'row', overflow: 'auto' }}>
              {/* Shortcuts sidebar */}
              <Box sx={{
                display: 'flex',
                flexDirection: mobileDevice ? 'row' : 'column',
                flexWrap: mobileDevice ? 'wrap' : 'nowrap',
                p: 1,
                borderRight: mobileDevice ? 'none' : '1px solid #e0e0e0',
                borderBottom: mobileDevice ? '1px solid #e0e0e0' : 'none',
                minWidth: mobileDevice ? 'unset' : 130,
                gap: mobileDevice ? 0.5 : 0,
              }}>
                {SHORTCUTS.map((s) => {
                  const shortcutSegment = s.route === '/' ? '/' : s.route.split('/').filter(Boolean).pop();
                  const isActive = currentSegment === shortcutSegment;
                  return (
                    <Button
                      key={s.label}
                      onClick={() => handleShortcut(s)}
                      size="small"
                      variant={isActive ? 'contained' : 'text'}
                      sx={{ justifyContent: 'flex-start', textTransform: 'none', fontSize: 12, py: 0.5 }}
                    >
                      {s.label}
                    </Button>
                  );
                })}
              </Box>
              

            </Paper>
          </Popover>
        </Box>

        <IconButton color="primary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}