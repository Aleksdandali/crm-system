import { Typography, Box, Paper } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <Typography color="textSecondary">
          User profile settings will be displayed here
        </Typography>
      </Paper>
    </Box>
  );
}
