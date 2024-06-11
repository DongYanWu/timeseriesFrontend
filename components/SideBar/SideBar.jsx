import * as React from "react";
import Box from "@mui/material/Box";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Home from "@mui/icons-material/Home";
import Settings from "@mui/icons-material/Settings";
import People from "@mui/icons-material/People";
import Dns from "@mui/icons-material/Dns";
import Public from "@mui/icons-material/Public";
import Link from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import SearchIcon from "@mui/icons-material/Search";
import BackupTableIcon from "@mui/icons-material/BackupTable";
// import { useRouter } from "next/router";

const data = [
  { icon: <SearchIcon />, label: "Search" },
  { icon: <SavedSearchIcon />, label: "Search with specific time" },
  { icon: <BackupTableIcon />, label: "Table" },
  { icon: <BarChartIcon />, label: "Visualization" },
  { icon: <Public />, label: "支持我們" },
  { icon: <LogoutIcon />, label: "登出" },
];
function getItemLink(label) {
  switch (label) {
    case "Search":
      return "/search";
    case "Search with specific time":
      return "/searchwithtime";
    case "Table":
      return "/table";
    case "Visualization":
      return "/test";
    default:
      return "";
  }
}
const FireNav = styled(List)({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
});

export default function SideBar({ shadow }) {
  // const router = useRouter();

  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        minHeight: "100%",
        boxShadow: shadow && "0 0 40px rgba(255, 255, 255, 0.5)",
        // overflowX: "auto",
        // overflowY: "scroll",
      }}
    >
      <Box
        sx={{ display: "flex", minHeight: "100%" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        <ThemeProvider
          theme={createTheme({
            components: {
              MuiListItemButton: {
                defaultProps: {
                  disableTouchRipple: true,
                },
              },
            },
            palette: {
              mode: "dark",
              primary: { main: "rgb(102, 157, 246)" },
              background: { paper: "rgb(5, 30, 52)" },
            },
          })}
        >
          <Paper
            elevation={0}
            sx={{
              width: 70,
              ":hover": { width: "300px", transition: "0.3s" },
            }}
          >
            <FireNav component="nav" disablePadding>
              <ListItemButton
                component="a"
                sx={{
                  minHeight: 32,
                  "&:hover": {
                    bgcolor: "rgba(71, 98, 130, 0.2)",
                  },
                }}
              >
                <ListItemIcon sx={{ fontSize: 20 }}>🐱</ListItemIcon>
                {isHovering && (
                  <ListItemText
                    sx={{ my: 0 }}
                    primary="TS-SearchDB"
                    primaryTypographyProps={{
                      fontSize: 20,
                      fontWeight: "700",
                      letterSpacing: 0,
                    }}
                  />
                )}
              </ListItemButton>
              <Divider />
              <Link href="/">
                <ListItem component="div" disablePadding>
                  <ListItemButton sx={{ minHeight: 32 }} className="listItem">
                    <ListItemIcon>
                      <Home color="primary" />
                    </ListItemIcon>
                    {isHovering && (
                      <ListItemText
                        primary="主頁"
                        primaryTypographyProps={{
                          color: "primary",
                          fontWeight: "medium",
                          variant: "body2",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Link>

              <Divider />
              <Box
                sx={{
                  bgcolor: null,
                  pb: 0,
                  height: "100%",
                }}
              >
                {data.map((item, index) => (
                  <ListItemButton
                    key={item.label}
                    sx={{
                      py: 0,
                      minHeight: 40,
                      color: "rgba(255,255,255,.8)",
                      "&:hover": {
                        bgcolor: "rgba(71, 98, 130, 0.2)",
                      },
                    }}
                    href={getItemLink(item.label)}
                    // onClick={index === 4 ? () => logoutHandler() : undefined}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    {isHovering && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: "medium",
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </Box>
            </FireNav>
          </Paper>
        </ThemeProvider>
      </Box>
    </div>
  );
}
