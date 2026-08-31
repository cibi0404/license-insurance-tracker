// frontend/src/pages/Welcome.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { INK, MUTED, LICENSE_COLOR, POLICY_COLOR, getGreeting } from '../theme/colors';

function StatTile({ label, value, color, icon: Icon, loading }) {
  return (
    <Card
      elevation={0}
      sx={{
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
          <Icon size={18} />
        </Box>
        <Typography
          variant="caption"
          sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: INK, lineHeight: 1.2, mt: 0.25 }}>
          {loading ? '—' : value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ActionTile({ to, label, description, color, icon: Icon }) {
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
          <Icon size={18} />
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

function InfoCard({ title, items }) {
  return (
    <Card elevation={0} sx={{ border: '1px solid #E6E8EE', borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: INK, mb: 1.5 }}>
          {title}
        </Typography>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {items.map((item, i) => (
            <Box
              key={i}
              component="li"
              sx={{ display: 'flex', gap: 1, py: 0.75, fontSize: 14, color: MUTED, lineHeight: 1.5 }}
            >
              <Box component="span" sx={{ color: LICENSE_COLOR, mt: '2px' }}>
                •
              </Box>
              <Box component="span">{item}</Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

function Welcome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        // Non-fatal here — the Dashboard page surfaces the real error if
        // something's actually wrong with the data. This page just falls
        // back to em-dashes rather than blocking the whole landing page.
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalActive = (stats?.licenses.active ?? 0) + (stats?.policies.active ?? 0);
  const totalExpiringSoon = (stats?.licenses['expiring-soon'] ?? 0) + (stats?.policies['expiring-soon'] ?? 0);
  const totalPending = (stats?.licenses['pending-verification'] ?? 0) + (stats?.policies['pending-verification'] ?? 0);

  return (
    <Box sx={{ maxWidth: 1200, width: '100%' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: INK }}>
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
        </Typography>
        <Typography variant="body2" sx={{ color: MUTED, mt: 0.5 }}>
          Here's a summary of your licenses and insurance policies.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <StatTile label="Active" value={totalActive} color={LICENSE_COLOR} icon={CheckCircle} loading={loading} />
        <StatTile label="Expiring soon" value={totalExpiringSoon} color="#B5820A" icon={Clock} loading={loading} />
        <StatTile label="Pending verification" value={totalPending} color={MUTED} icon={AlertCircle} loading={loading} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: INK, mb: 1.5 }}>
          Quick actions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <ActionTile
            to="/dashboard"
            label="Go to dashboard"
            description="View all your records at a glance"
            color={LICENSE_COLOR}
            icon={LayoutDashboard}
          />
          <ActionTile
            to="/licenses"
            label="Manage licenses"
            description="View and manage your licenses"
            color={POLICY_COLOR}
            icon={FileText}
          />
          <ActionTile
            to="/policies"
            label="Manage policies"
            description="View and manage your insurance policies"
            color={LICENSE_COLOR}
            icon={ShieldCheck}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <InfoCard
          title="Quick tips"
          items={[
            'Keep your licenses updated to avoid compliance issues.',
            'Review your insurance policies regularly for coverage gaps.',
            'Set reminders for renewal dates to avoid lapses.',
          ]}
        />
        <InfoCard
          title="Need help?"
          items={[
            'Check your licenses for upcoming renewal dates.',
            'Review your policies for coverage details.',
            'Contact your administrator for account or access questions.',
          ]}
        />
      </Box>
    </Box>
  );
}

export default Welcome;