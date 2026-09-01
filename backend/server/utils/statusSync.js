const EXPIRING_SOON_WINDOW_DAYS = 30;

async function syncExpiryStatuses(Model, filter = {}) {
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + EXPIRING_SOON_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  await Promise.all([
    Model.updateMany(
      { ...filter, expiryDate: { $lt: now }, status: { $nin: ['expired', 'pending-verification'] } },
      { $set: { status: 'expired' } }
    ),
    Model.updateMany(
      {
        ...filter,
        expiryDate: { $gte: now, $lte: soonThreshold },
        status: { $nin: ['expiring-soon', 'expired', 'pending-verification'] },
      },
      { $set: { status: 'expiring-soon' } }
    ),
    Model.updateMany(
      {
        ...filter,
        expiryDate: { $gt: soonThreshold },
        status: { $nin: ['active', 'pending-verification'] },
      },
      { $set: { status: 'active' } }
    ),
  ]);
}

function computeInitialStatus(expiryDate) {
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + EXPIRING_SOON_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const expiry = new Date(expiryDate);

  if (expiry < now) return 'expired';
  if (expiry <= soonThreshold) return 'expiring-soon';
  return 'active';
}

module.exports = { syncExpiryStatuses, computeInitialStatus };
