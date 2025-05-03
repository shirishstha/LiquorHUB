const validUpdates = {
    "pending": ["cancelled"],
    "processing": ["delivered", "cancelled"],
    "delivered": [],
    "cancelled": []
}

function isValidUpdates(currentStatus, newStatus) {
    const allowed = validUpdates[currentStatus] || [];
    return allowed.includes(newStatus);
}


module.exports = isValidUpdates;