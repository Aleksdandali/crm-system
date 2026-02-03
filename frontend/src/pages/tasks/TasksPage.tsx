import { Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function TasksPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Task
        </Button>
      </Box>
      <Typography>Task management will be displayed here</Typography>
    </Box>
  );
}
