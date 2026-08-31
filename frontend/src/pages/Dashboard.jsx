import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningAmberIcon,
  ErrorOutlineOutlined as ErrorOutlineIcon,
  DescriptionOutlined as DescriptionIcon,
} from '@mui/icons-material';
import { Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { INK, MUTED, LICENSE_COLOR, POLICY_COLOR, STATUS_LABELS, STATUS_COLORS, getGreeting } from '../theme/colors';

function StatCard({ label, value, color, icon }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid #E6E8EE',
        borderRadius: 3,
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(18,22,42,0.06)', borderColor: '#D8DCE6' },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}1A`,
            color,
            mb: 1.5,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="caption"
          sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: INK, lineHeight: 1.2, mt: 0.25 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

// Slim segmented bar showing how the whole record set breaks down by status.
// This is the one "signature" visual on the page — a single glance answer to
// "are we in good shape overall?" before anyone reads a single number.
function ComplianceBar({ counts, total }) {
  if (!total) return null;
  const segments = Object.keys(STATUS_LABELS).map((key) => ({
    key,
    label: STATUS_LABELS[key],
    color: STATUS_COLORS[key],
    value: counts[key] ?? 0,
    pct: ((counts[key] ?? 0) / total) * 100,
  }));

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', width: '100%', height: 10, borderRadius: 999, overflow: 'hidden', bgcolor: '#EEF0F4' }}>
        {segments
          .filter((s) => s.pct > 0)
          .map((s) => (
            <Box key={s.key} sx={{ width: `${s.pct}%`, bgcolor: s.color }} title={`${s.label}: ${s.value}`} />
          ))}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 1.25 }}>
        {segments.map((s) => (
          <Box key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
            <Typography variant="caption" sx={{ color: MUTED }}>
              {s.label} · {s.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// Two shortcut tiles so people can jump straight to adding a record instead
// of hunting through the nav — the most common thing anyone does right
// after checking the dashboard.
function QuickActionCard({ to, label, description, color }) {
  return (
    <Card
      component={Link}
      to={to}
      elevation={0}
      sx={{
        display: 'block',
        textDecoration: 'none',
        border: '1px solid #E6E8EE',
        borderRadius: 3,
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(18,22,42,0.06)', borderColor: '#D8DCE6' },
      }}
    >
      <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}1A`,
            color,
            flexShrink: 0,
          }}
        >
          <Plus size={18} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, color: INK, fontSize: 14 }}>{label}</Typography>
          <Typography variant="caption" sx={{ color: MUTED }}>
            {description}
          </Typography>
        </Box>
        <ArrowRight size={16} color={MUTED} />
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
  const totalPending = (stats?.licenses['pending-verification'] ?? 0) + (stats?.policies['pending-verification'] ?? 0);
  const totalItems = (stats?.licenses.total ?? 0) + (stats?.policies.total ?? 0);

  const statuses = Object.keys(STATUS_LABELS);
  const chartLabels = statuses.map((s) => STATUS_LABELS[s]);
  const licenseSeries = statuses.map((s) => stats?.licenses[s] ?? 0);
  const policySeries = statuses.map((s) => stats?.policies[s] ?? 0);

  return (
    <Box sx={{ width: '100%' }}>
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: '1px solid #E6E8EE',
            borderRadius: 3,
            background: `linear-gradient(135deg, ${LICENSE_COLOR}0D 0%, ${POLICY_COLOR}0D 100%)`,
          }}
        >
          <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: INK }}>
                {getGreeting()}, {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: MUTED, mt: 0.5 }}>
                Here's the compliance status across all tracked records.
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                sx={{
                  mt: 1.5,
                  bgcolor: `${LICENSE_COLOR}14`,
                  color: LICENSE_COLOR,
                  fontWeight: 600,
                  border: `1px solid ${LICENSE_COLOR}33`,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${LICENSE_COLOR}14`,
                  color: LICENSE_COLOR,
                }}
              >
                <ShieldCheck size={26} />
              </Box>
              <Typography variant="caption" sx={{ color: MUTED, fontWeight: 500 }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <QuickActionCard
              to="/licenses"
              label="Add a license"
              description="Register a new license to track"
              color={LICENSE_COLOR}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <QuickActionCard
              to="/policies"
              label="Add an insurance policy"
              description="Register a new policy to track"
              color={POLICY_COLOR}
            />
          </Grid>
        </Grid>

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
            <ComplianceBar
              counts={{
                active: totalActive,
                'expiring-soon': totalExpiringSoon,
                expired: totalExpired,
                'pending-verification': totalPending,
              }}
              total={totalItems}
            />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatCard label="Total records" value={totalItems} color={LICENSE_COLOR} icon={<DescriptionIcon fontSize="small" />} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatCard label="Active" value={totalActive} color={STATUS_COLORS.active} icon={<CheckCircleIcon fontSize="small" />} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatCard label="Expiring soon" value={totalExpiringSoon} color={STATUS_COLORS['expiring-soon']} icon={<WarningAmberIcon fontSize="small" />} />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatCard label="Expired" value={totalExpired} color={STATUS_COLORS.expired} icon={<ErrorOutlineIcon fontSize="small" />} />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card elevation={0} sx={{ border: '1px solid #E6E8EE', borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: INK, mb: 2 }}>
                      Licenses vs. policies by status
                    </Typography>
                    <BarChart
                      height={320}
                      xAxis={[{ scaleType: 'band', data: chartLabels }]}
                      series={[
                        { data: licenseSeries, label: 'Licenses', color: LICENSE_COLOR },
                        { data: policySeries, label: 'Policies', color: POLICY_COLOR },
                      ]}
                      margin={{ left: 40, right: 20, top: 20, bottom: 40 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Card elevation={0} sx={{ border: '1px solid #E6E8EE', borderRadius: 3, height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: INK, mb: 2 }}>
                      Expiring in next 30 days
                    </Typography>
                    {stats.expiringSoonItems.length === 0 ? (
                      <Box sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: MUTED }}>
                          Nothing expiring soon — everything on record is current.
                        </Typography>
                      </Box>
                    ) : (
                      <List dense disablePadding>
                        {stats.expiringSoonItems.map((item, idx) => (
                          <Box key={item.id}>
                            <ListItem
                              disableGutters
                              sx={{ py: 1.25 }}
                              secondaryAction={
                                <Chip
                                  label={new Date(item.expiryDate).toLocaleDateString()}
                                  size="small"
                                  sx={{
                                    bgcolor: `${STATUS_COLORS['expiring-soon']}14`,
                                    color: STATUS_COLORS['expiring-soon'],
                                    fontWeight: 600,
                                    border: `1px solid ${STATUS_COLORS['expiring-soon']}33`,
                                  }}
                                />
                              }
                            >
                              <ListItemText
                                primary={<Typography sx={{ fontWeight: 600, color: INK, fontSize: 14 }}>{item.label}</Typography>}
                                secondary={
                                  <Typography variant="caption" sx={{ color: MUTED }}>
                                    {item.type}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {idx < stats.expiringSoonItems.length - 1 && <Divider />}
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
  );
}

export default Dashboard;