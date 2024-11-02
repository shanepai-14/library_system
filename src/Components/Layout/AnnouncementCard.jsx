import React from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  styled
} from '@mui/material';
import { 
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon 
} from '@mui/icons-material';

// Custom styled components with modern animations and effects
const GlassCard = styled(Card)`
  position: relative;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px !important;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    animation: shimmer 4s infinite;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  @keyframes shimmer {
    0% {
      transform: rotate(0deg) translate(-50%, -50%);
    }
    100% {
      transform: rotate(360deg) translate(-50%, -50%);
    }
  }
`;

const GlowingTitle = styled(Typography)`
  position: relative;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
  
  @keyframes glow {
    from {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    to {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                   0 0 30px rgba(255, 255, 255, 0.6);
    }
  }
`;

const MetaInfo = styled(Box)`
  display: flex;
  gap: 20px;
  margin: 16px 0;
  color: rgba(255, 255, 255, 0.8);
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContentArea = styled(Box)`
  color: rgba(255, 255, 255, 0.9);
  margin: 20px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const AuthorSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .author-info {
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
`;

const AnnouncementCard = ({ announcement }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <GlassCard>
      <CardContent>
        <GlowingTitle variant="h5" component="h2">
          {announcement.title}
        </GlowingTitle>

        <MetaInfo>
          <Box className="meta-item">
            <PersonIcon fontSize="small" />
            <Typography variant="body2">
              {`${announcement.author.first_name} ${announcement.author.last_name}`}
            </Typography>
          </Box>
          <Box className="meta-item">
            <CalendarIcon fontSize="small" />
            <Typography variant="body2">
              {formatDate(announcement.created_at)}
            </Typography>
          </Box>
          <Box className="meta-item">
            <ClockIcon fontSize="small" />
            <Typography variant="body2">
              {formatTime(announcement.created_at)}
            </Typography>
          </Box>
        </MetaInfo>

        <ContentArea>
          <Typography 
            variant="body1" 
            component="div"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </ContentArea>

        <AuthorSection>
          <StyledAvatar
            src={announcement.author.profile_picture}
            alt={`${announcement.author.first_name} ${announcement.author.last_name}`}
          >
            <PersonIcon />
          </StyledAvatar>
          <Box className="author-info">
            <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {`${announcement.author.first_name} ${announcement.author.last_name}`}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {announcement.author.position}
            </Typography>
          </Box>
        </AuthorSection>
      </CardContent>
    </GlassCard>
  );
};

export default AnnouncementCard;