'use client';

import { useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import MicIcon from '@mui/icons-material/Mic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditIcon from '@mui/icons-material/Edit';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';

const navItems = [
    { text: 'Home', icon: <HomeIcon />, href: '/' },
    { text: 'Tomorrow', icon: <CalendarTodayOutlinedIcon />, href: '/pages/Tomorrow' },
    { text: 'Today', icon: <TodayOutlinedIcon />, href: '/pages/Today' },
    { text: 'Yesterday', icon: <EventOutlinedIcon />, href: '/pages/Yesterday' },
    { text: 'Week', icon: <DateRangeOutlinedIcon />, href: '/pages/Week' },
    { text: 'Month', icon: <CalendarMonthOutlinedIcon />, href: '/pages/Month' },
    { text: 'Grouped Day', icon: <TodayOutlinedIcon />, href: '/pages/GroupedDay' },
    { text: 'Grouped Month', icon: <CalendarMonthOutlinedIcon />, href: '/pages/GroupedMonth' },
    { text: 'Grouped Year', icon: <CalendarMonthOutlinedIcon />, href: '/pages/GroupedYear' },
    { text: 'One Day', icon: <TodayOutlinedIcon />, href: '/pages/OneDay' },
    { text: 'One Month', icon: <CalendarMonthOutlinedIcon />, href: '/pages/OneMonth' },
    { text: 'One Year', icon: <CalendarMonthOutlinedIcon />, href: '/pages/OneYear' },
];

export default function Bottom() {
  const { currentUrl } = useContext(GlobalContext);
  const router = useRouter();
  const scrollRef = useRef(null);
  
  // Extract only the last part of the URL
  const getLastSegment = (url) => {
    if (url === '/') return '/';
    const segments = url.split('/').filter(Boolean);
    return segments[segments.length - 1];
  };
  
  const currentSegment = getLastSegment(currentUrl);
  
  const activeIndex = navItems.findIndex(({ href }) => {
    const hrefSegment = href === '/' ? '/' : href.split('/').filter(Boolean).pop();
    return hrefSegment === currentSegment;
  });

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 150, behavior: 'smooth' });
  };

  return (
    <Paper
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={3}
    >
      <IconButton size="small" onClick={() => scroll(-1)} sx={{ flexShrink: 0 }}>
        <ChevronLeftIcon />
      </IconButton>

      <div ref={scrollRef} style={{ flex: 1, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <BottomNavigation
          showLabels
          value={activeIndex}
          onChange={(_, newValue) => router.push(navItems[newValue].href)}
          sx={{ width: `${navItems.length * 80}px`, '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {navItems.map(({ text, icon }) => (
            <BottomNavigationAction
              key={text}
              label={text}
              icon={icon}
              sx={{
                minWidth: 72,
                flexShrink: 0,
                '&.Mui-selected': {
                  backgroundColor: '#008bc133',
                  color: '#008bc1',
                  '& .MuiSvgIcon-root': { color: '#008bc1' },
                },
              }}
            />
          ))}
        </BottomNavigation>
      </div>

      <IconButton size="small" onClick={() => scroll(1)} sx={{ flexShrink: 0 }}>
        <ChevronRightIcon />
      </IconButton>
    </Paper>
  );
}
