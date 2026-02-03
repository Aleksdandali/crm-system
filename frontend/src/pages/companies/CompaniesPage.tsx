import { Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function CompaniesPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Companies</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Company
        </Button>
      </Box>
      <Typography>Companies list will be displayed here</Typography>
    </Box>
  );
}
