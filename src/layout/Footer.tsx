import { AutoStoriesOutlined, HomeOutlined, LightbulbOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const [value, setValue] = useState('home');
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    switch (newValue) {
      case 'home':
        navigate('/');
        break;
      case 'analyze':
        navigate('/analyze');
        break;
      case 'learn':
        navigate('/learn');
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  return (
    <footer>
      <div id="write" className="md:hidden"></div>
      <div className="md:hidden">
        <div className="w-full size-14"></div>
        <Paper className="fixed bottom-0 end-0 w-full" elevation={3}>
          <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction label="Home" value="home" icon={<HomeOutlined />} />
            <BottomNavigationAction label="Analyze" value="analyze" icon={<AutoStoriesOutlined />} />
            <BottomNavigationAction label="Learn" value="learn" icon={<LightbulbOutlined />} />
            <BottomNavigationAction label="Profile" value="profile" icon={<PersonOutlineOutlined />} />
          </BottomNavigation>
        </Paper>
      </div>
    </footer>
  );
}
