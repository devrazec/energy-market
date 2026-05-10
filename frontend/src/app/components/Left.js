'use client';

import Link from 'next/link';
import { useContext } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { GlobalContext } from '../context/GlobalContext';
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

const DRAWER_WIDTH = 240;

const mainNavItems = [
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

export default function Left() {

    const { currentUrl } = useContext(GlobalContext);
    
    // Extract only the last part of the URL
    const getLastSegment = (url) => {
        if (url === '/') return '/';
        const segments = url.split('/').filter(Boolean);
        return segments[segments.length - 1];
    };
    
    const currentSegment = getLastSegment(currentUrl);

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <List>
                {mainNavItems.map(({ text, icon, href }) => {
                    const hrefSegment = href === '/' ? '/' : href.split('/').filter(Boolean).pop();
                    const isSelected = currentSegment === hrefSegment;
                    return (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={href}
                            sx={{
                                backgroundColor: isSelected ? '#008bc1' : 'transparent',
                                color: isSelected ? '#fff' : 'inherit',
                                '& .MuiListItemIcon-root': {
                                    color: isSelected ? '#fff' : 'inherit',
                                },
                                '&:hover': {
                                    backgroundColor: isSelected ? '#006a94' : 'rgba(0, 139, 193, 0.1)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                    );
                })}
            </List>
            
        </Drawer>
    );
}
