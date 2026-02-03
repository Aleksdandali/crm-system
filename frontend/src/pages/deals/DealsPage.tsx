import { Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function DealsPage() {
  const stages = ['qualification', 'proposal', 'negotiation', 'closing', 'won', 'lost'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Deals Pipeline</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Deal
        </Button>
      </Box>
      <Grid container spacing={2}>
        {stages.map((stage) => (
          <Grid item xs={12} sm={6} md={2} key={stage}>
            <Paper sx={{ p: 2, minHeight: 400 }}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 2 }}>
                {stage}
              </Typography>
              <Typography color="textSecondary">No deals</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
