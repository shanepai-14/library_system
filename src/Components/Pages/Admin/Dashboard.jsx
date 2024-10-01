import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
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
import { Link } from "react-router-dom";
import { adminStats } from "../../../Utils/endpoint";
import api from "../../../Utils/interceptor";
import DashboardCardSkeleton from "./DashboardCardSkeleton";
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
      <Card
        style={{ backgroundColor: bgColor, borderRadius: "12px", width: 220 }}
      >
        <CardContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "16px",
          }}
        >
          <div
            style={{ marginRight: "20px", fontSize: "40px", color: "white" }}
          >
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    api
      .get(adminStats())
      .then((res) => {
        setStats(res.data);
        setSnackbar({ open: true, message: "Stats fetched successfully!" });
        console.log(res.data);
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Error fetching stats. Please try again.",
        });
        console.error("Error fetching stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <DashboardCardSkeleton />
            ))
          : stats.map((item, index) => (
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
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </>
  );
};

export default Dashboard;
