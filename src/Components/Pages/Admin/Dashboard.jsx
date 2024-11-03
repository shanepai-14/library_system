import React from "react";
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SchoolIcon from "@mui/icons-material/School";
import EventIcon from "@mui/icons-material/Event";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Snackbar from "@mui/material/Snackbar";
import DashboardCardSkeleton from '../../Common/DashboardCardSkeleton';
import { Link } from "react-router-dom";
import { adminStats } from "../../../Utils/endpoint";
import api from "../../../Utils/interceptor";

const iconMapping = {
  Students: SchoolIcon,
  Attendance: EventIcon,
  Books: MenuBookIcon,
  Authors: PersonIcon,
  Post: AnnouncementIcon,
  "Issued Books": AssignmentIcon,
  Category: AssignmentIcon,
};

const DashboardCard = ({ title, count, bgColor, link }) => {
  const IconComponent = iconMapping[title] || AssignmentIcon;
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Card style={{ backgroundColor: bgColor, borderRadius: "12px", width: 220 }}>
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <div style={{ marginRight: "20px", fontSize: "40px", color: "white" }}>
            <IconComponent fontSize="inherit" />
          </div>
          <div>
            <Typography variant="h6" component="div" color="white">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color="white">
              {count}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Custom hook for fetching stats
const useStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await api.get(adminStats());
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    retry: 2, // Retry failed requests twice
  });
};

const Dashboard = () => {
  const [snackbarState, setSnackbarState] = React.useState({
    open: false,
    message: "",
  });

  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useStats();

  React.useEffect(() => {
    if (isError) {
      setSnackbarState({
        open: true,
        message: "Error fetching stats. Please try again.",
      });
    }
  }, [isError]);

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
      >
        {isLoading
          ? Array.from(new Array(8)).map((_, index) => (
              <DashboardCardSkeleton key={index} />
            ))
          : stats?.map((item, index) => (
              <DashboardCard
                key={index}
                title={item.title}
                count={item.count}
                bgColor={item.bgColor}
                link={item.link}
              />
            ))}
      </Grid>
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarState.message}
      />
    </>
  );
};

export default Dashboard;