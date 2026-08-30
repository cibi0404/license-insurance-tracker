import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArticleIcon from '@mui/icons-material/Article';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';

const STATUS_LABELS = {
  active: 'Active',
  'expiring-soon': 'Expiring Soon',
  expired: 'Expired',
  'pending-verification': 'Pending Verification',
};

const STATUS_COLORS = {
  active: '#16a34a',
  'expiring-soon': '#eab308',
  expired: '#dc2626',
  'pending-verification': '#64748b',
};

function StatCard({ label, value, color, icon }) {
  return (
    <Card sx={{ borderLeft: `4px solid ${color}`, height: '100%' }} elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalActive = (stats?.licenses.active ?? 0) + (stats?.policies.active ?? 0);
  const totalExpiringSoon = (stats?.licenses['expiring-soon'] ?? 0) + (stats?.policies['expiring-soon'] ?? 0);
  const totalExpired = (stats?.licenses.expired ?? 0) + (stats?.policies.expired ?? 0);
  const totalItems = (stats?.licenses.total ?? 0) + (stats?.policies.total ?? 0);

  const statuses = Object.keys(STATUS_LABELS);
  const chartLabels = statuses.map((s) => STATUS_LABELS[s]);
  const licenseSeries = statuses.map((s) => stats?.licenses[s] ?? 0);
  const policySeries = statuses.map((s) => stats?.policies[s] ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Role: {user?.role}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {stats && (
          <>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <StatCard label="Total Records" value={totalItems} color="#2563eb" icon={<ArticleIcon fontSize="large" />} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard label="Active" value={totalActive} color={STATUS_COLORS.active} icon={<CheckCircleIcon fontSize="large" />} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard label="Expiring Soon" value={totalExpiringSoon} color={STATUS_COLORS['expiring-soon']} icon={<WarningAmberIcon fontSize="large" />} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatCard label="Expired" value={totalExpired} color={STATUS_COLORS.expired} icon={<ErrorOutlineIcon fontSize="large" />} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Licenses vs. Policies by Status
                    </Typography>
                    <BarChart
                      height={320}
                      xAxis={[{ scaleType: 'band', data: chartLabels }]}
                      series={[
                        { data: licenseSeries, label: 'Licenses', color: '#2563eb' },
                        { data: policySeries, label: 'Policies', color: '#7c3aed' },
                      ]}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      Expiring in Next 30 Days
                    </Typography>
                    {stats.expiringSoonItems.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nothing expiring soon. You're all caught up.
                      </Typography>
                    ) : (
                      <List dense>
                        {stats.expiringSoonItems.map((item, idx) => (
                          <Box key={item.id}>
                            <ListItem
                              disableGutters
                              secondaryAction={
                                <Chip
                                  label={new Date(item.expiryDate).toLocaleDateString()}
                                  size="small"
                                  sx={{ bgcolor: '#fef9c3', color: '#854d0e' }}
                                />
                              }
                            >
                              <ListItemText primary={item.label} secondary={item.type} />
                            </ListItem>
                            {idx < stats.expiringSoonItems.length - 1 && <Divider component="li" />}
                          </Box>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
}

export default Dashboard;