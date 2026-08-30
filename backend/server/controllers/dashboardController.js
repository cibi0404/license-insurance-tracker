const License = require('../models/License');
const InsurancePolicy = require('../models/InsurancePolicy');

const STATUSES = ['active', 'expiring-soon', 'expired', 'pending-verification'];

const emptyStatusCounts = () =>
  STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), { total: 0 });

const countsByStatus = async (Model, filter) => {
  const results = await Model.aggregate([
    { $match: filter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const counts = emptyStatusCounts();
  results.forEach((r) => {
    counts[r._id] = r.count;
    counts.total += r.count;
  });
  return counts;
};

// GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'Employee') {
      filter.holder = req.user._id;
    }

    const [licenseCounts, policyCounts] = await Promise.all([
      countsByStatus(License, filter),
      countsByStatus(InsurancePolicy, filter),
    ]);

    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringSoonFilter = {
      ...filter,
      expiryDate: { $gte: now, $lte: in30Days },
      status: { $ne: 'expired' },
    };

    const [expiringLicenses, expiringPolicies] = await Promise.all([
      License.find(expiringSoonFilter)
        .select('licenseType licenseNumber expiryDate')
        .sort('expiryDate')
        .limit(5),
      InsurancePolicy.find(expiringSoonFilter)
        .select('coverageType policyNumber expiryDate')
        .sort('expiryDate')
        .limit(5),
    ]);

    res.json({
      licenses: licenseCounts,
      policies: policyCounts,
      expiringSoonCount: expiringLicenses.length + expiringPolicies.length,
      expiringSoonItems: [
        ...expiringLicenses.map((l) => ({
          id: l._id,
          type: 'License',
          label: `${l.licenseType} (${l.licenseNumber})`,
          expiryDate: l.expiryDate,
        })),
        ...expiringPolicies.map((p) => ({
          id: p._id,
          type: 'Policy',
          label: `${p.coverageType} (${p.policyNumber})`,
          expiryDate: p.expiryDate,
        })),
      ].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };