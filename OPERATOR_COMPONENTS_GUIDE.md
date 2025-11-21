# Quick Implementation Guide for Remaining Components

## For Jio, Vi, and BSNL Components

Since these operator components have the same structure as Airtel, apply the following changes to each:

### 1. Update Imports (Top of file)

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, LoadingSpinner, ErrorMessage } from './common';
import { toast } from '../utils/toast';
import './[ComponentName].css';  // e.g., Jio.css, Vi.css, BSNL.css
```

### 2. Add Error State

In the state declarations, add:
```jsx
const [error, setError] = useState('');
```

### 3. Update fetchOperator Function

Replace the existing fetchOperator with:
```jsx
useEffect(() => {
  const fetchOperator = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/v1/operators');
      if (!response.ok) {
        throw new Error('Failed to fetch operators');
      }
      const resJson = await response.json();
      const operators = resJson?.data || resJson;
      const operatorData = Array.isArray(operators) 
        ? operators.find(op => op.name === '[OPERATOR_NAME]')  // Replace with 'Jio', 'Vi', or 'BSNL'
        : null;
      if (operatorData) {
        setOperator(operatorData);
      } else {
        setError('[Operator] data not found');
      }
    } catch (error) {
      console.error('Error fetching operator:', error);
      setError('Failed to load [Operator] plans. Please try again.');
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  fetchOperator();
}, []);
```

### 4. Update handleRecharge Function

```jsx
const handleRecharge = (pack) => {
  if (!mobileNumber) {
    toast.warning('Please enter mobile number');
    return;
  }
  
  if (mobileNumber.length !== 10) {
    toast.warning('Please enter a valid 10-digit mobile number');
    return;
  }
  
  const rechargeDetails = {
    ...pack,
    mobileNumber: mobileNumber,
    operator: '[OPERATOR_NAME]',  // Replace with 'Jio', 'Vi', or 'BSNL'
    operatorId: operator._id,
    planId: pack._id
  };
  
  onRechargeInitiate(rechargeDetails);
  navigate('/payment', { state: rechargeDetails });
};
```

### 5. Update Loading and Error States

Replace the loading/error render sections:
```jsx
if (!isAuthenticated) {
  return null;
}

if (loading) {
  return (
    <div className="[component-class-name]">  {/* e.g., jio-page, vi-page, bsnl-page */}
      <LoadingSpinner fullscreen text="Loading [Operator] plans..." />
    </div>
  );
}

if (error || !operator) {
  return (
    <div className="[component-class-name]">
      <div className="error-container">
        <ErrorMessage 
          title="Unable to Load Plans"
          message={error || 'Operator data not available'}
          type="error"
          onRetry={() => window.location.reload()}
        />
      </div>
    </div>
  );
}
```

### 6. Update Pack Cards Rendering

Replace the packs grid section:
```jsx
<div className="packs-grid">
  {filteredPacks.length === 0 ? (
    <div className="no-results">
      <p>No plans found matching your search.</p>
    </div>
  ) : (
    filteredPacks.map((pack, index) => (
      <Card key={index} className="pack-card" variant="elevated">
        <div className="pack-amount">₹{pack.amount}</div>
        <div className="pack-details">
          <div className="pack-validity">Validity: {pack.validity}</div>
          <div className="pack-data">Data: {pack.data}</div>
          <div className="pack-calls">Calls: {pack.calls}</div>
          <div className="pack-sms">SMS: {pack.sms}</div>
        </div>
        <div className="pack-description">{pack.description}</div>
        <Button 
          variant="primary" 
          fullWidth
          onClick={() => handleRecharge(pack)}
          disabled={!mobileNumber || mobileNumber.length !== 10}
        >
          Recharge Now
        </Button>
      </Card>
    ))
  )}
</div>
```

### 7. Update CSS Files

At the top of each CSS file, add:
```css
@import '../styles/variables.css';
```

Update the main page class:
```css
.[component-page-class] {  /* e.g., .jio-page, .vi-page, .bsnl-page */
  margin-top: 80px;
  min-height: 100vh;
  background: var(--color-bg-secondary);
  scroll-behavior: smooth;
  position: relative;
}

.error-container {
  max-width: 600px;
  margin: var(--spacing-3xl) auto;
  padding: var(--spacing-xl);
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}
```

## Testing Checklist

After implementing changes for each operator:

- [ ] Component loads without errors
- [ ] Loading spinner shows while fetching data
- [ ] Error message displays if API fails
- [ ] Toast notifications work correctly
- [ ] Mobile number validation works (10 digits required)
- [ ] Recharge button is disabled when mobile number is invalid
- [ ] Button shows proper hover/active/disabled states
- [ ] Cards have consistent styling with hover effects
- [ ] Page is responsive on mobile devices
- [ ] "No results" message shows when search has no matches

## Estimated Time

- Jio component: 10-15 minutes
- Vi component: 10-15 minutes  
- BSNL component: 10-15 minutes

Total: 30-45 minutes for all three

## Notes

- The operator name strings should match exactly what's in your database
- Make sure to test each component with both successful and failed API calls
- Check mobile responsiveness at 768px and 480px breakpoints
- Verify all toast messages are clear and helpful
