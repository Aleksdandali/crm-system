import { Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function EmailsPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Emails</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Compose Email
        </Button>
      </Box>
      <Typography>Email integration will be displayed here</Typography>
    </Box>
  );
}
