// BSNL.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BSNL.css';
import './Operator.css';
import BSNLLogo from './bsnl-logo.svg';

const BSNL = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
	const [mobileNumber, setMobileNumber] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('recommended');
	const [operator, setOperator] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fallbackPlans = {
		name: 'BSNL',
		_id: 'bsnl-fallback',
		plans: [
			{ _id: 'b-r1', amount: 98, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Economical monthly plan' },
			{ _id: 'b-r2', amount: 153, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular monthly choice' },
			{ _id: 'b-r3', amount: 187, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Extended value pack' },
			{ _id: 'b-u1', amount: 289, validity: '30 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Unlimited data monthly' },
			{ _id: 'b-u2', amount: 389, validity: '60 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Extended unlimited pack' },
			{ _id: 'b-u3', amount: 499, validity: '90 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Long-term unlimited' },
			{ _id: 'b-e1', amount: 297, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment plan with extras' },
			{ _id: 'b-e2', amount: 397, validity: '180 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'High data entertainment pack' },
			{ _id: 'b-e3', amount: 549, validity: '90 days', data: '3.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium OTT bundle' },
			{ _id: 'b-m1', amount: 108, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic monthly' },
			{ _id: 'b-m2', amount: 199, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Standard monthly' },
			{ _id: 'b-m3', amount: 247, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month value' },
			{ _id: 'b-y1', amount: 1199, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Annual plan with extra benefits' },
			{ _id: 'b-y2', amount: 1498, validity: '365 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium yearly pack' },
			{ _id: 'b-y3', amount: 1999, validity: '365 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Best annual value' },
			{ _id: 'b-ro1', amount: 2799, validity: '30 days', data: '10GB roaming', calls: 'International', sms: '-', description: 'International roaming pack' },
			{ _id: 'b-ro2', amount: 597, validity: '30 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Roaming-ready plan' },
			{ _id: 'b-ro3', amount: 797, validity: '30 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Premium roaming bundle' },
			{ _id: 'b-off1', amount: 49, validity: '3 days', data: '500MB/day', calls: '50 min', sms: '—', description: 'Trial weekend offer' },
			{ _id: 'b-off2', amount: 79, validity: '10 days', data: '1GB/day', calls: '100 min/day', sms: '50/day', description: 'Introductory special' },
			{ _id: 'b-off3', amount: 197, validity: '28 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Festive bonus offer' }
		]
	};

	useEffect(()=>{ if(!isAuthenticated) navigate('/login'); },[isAuthenticated,navigate]);

	useEffect(()=>{
		const fetchOp=async()=>{ setLoading(true); try{ const res=await fetch('http://localhost:5000/api/v1/operators'); const json=await res.json(); const ops=json?.data||json; const found=Array.isArray(ops)?ops.find(o=>o.name==='BSNL'):null; setOperator(found||fallbackPlans);}catch(e){ setOperator(fallbackPlans);}finally{setLoading(false)} };
		fetchOp();
	},[]);

	const categorizePlans = (plans) => {
		if(!plans) return {};
		const categorized={recommended:[],unlimited:[],entertainment:[],monthly:[],yearly:[],roaming:[],special:[],all:plans};
		plans.forEach(plan=>{ const amt=Number(plan.amount); const desc=(plan.description||'').toLowerCase(); const dataStr=(plan.data||'').toLowerCase(); if(plan._id&&plan._id.includes('off')) categorized.special.push(plan); if([98,108,153,187].includes(amt)) categorized.recommended.push(plan); if(desc.includes('unlimited')||dataStr.includes('unlimited')) categorized.unlimited.push(plan); if(desc.includes('ott')||desc.includes('entertain')||desc.includes('streaming')||(amt>=289&&amt<800)) categorized.entertainment.push(plan); if(amt<300&&plan.validity&&(plan.validity.includes('28')||plan.validity.includes('56')||plan.validity.includes('30'))) categorized.monthly.push(plan); if(plan.validity&&plan.validity.includes('365')) categorized.yearly.push(plan); if(desc.includes('roam')||desc.includes('international')||amt>=2000) categorized.roaming.push(plan); });
		return categorized;
	};

	const rechargePacks = operator ? categorizePlans(operator.plans) : {};
	const filteredPacks = rechargePacks[selectedCategory] ? rechargePacks[selectedCategory].filter(pack=> pack.amount.toString().includes(searchQuery) || (pack.description||'').toLowerCase().includes(searchQuery.toLowerCase())) : [];
	const displayCategories = ['recommended','unlimited','entertainment','monthly','yearly','roaming','special','all'];

	const handleRecharge=(pack)=>{ if(!mobileNumber){ alert('Please enter mobile number'); return } if(mobileNumber.length!==10||!/^\d{10}$/.test(mobileNumber)){ alert('Enter a valid 10-digit number'); return } const rechargeDetails={...pack,mobileNumber,operator:'BSNL',operatorId:operator?._id,planId:pack._id}; if(typeof onRechargeInitiate==='function') onRechargeInitiate(rechargeDetails); navigate('/payment',{state:rechargeDetails}); };

		if (!isAuthenticated) return null;

		return (
			<div className="operator-page bsnl-page">
				<header className="operator-navbar">
					<div className="navbar-container">
						<div className="operator-logo">
							<img src={BSNLLogo} alt="BSNL" />
							<div className="operator-meta">
								<div className="operator-title">BSNL</div>
								<div className="operator-sub">Prepaid · Broadband · Postpaid</div>
							</div>
						</div>

						<nav className="nav-menu" aria-label="Main menu">
							<button className="nav-btn">Offers</button>
							<button className="nav-btn">Plans</button>
							<button className="nav-btn">Help</button>
						</nav>

						<div className="profile-section">
							<div className="profile-icon">{currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}</div>
							<div className="profile-name">{currentUser || 'User'}</div>
						</div>
					</div>
				</header>

				<main className="main-content">
					<aside className="left-panel">
						<div className="mobile-input-section">
							<h3>Mobile number</h3>
							<div className="input-group">
								<div className="country-code">+91</div>
								<input
									className="mobile-input"
									type="tel"
									value={mobileNumber}
									onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
									maxLength={10}
									placeholder="Enter 10-digit mobile"
								/>
							</div>
						</div>

						<div className="search-section">
							<h3>Search packs</h3>
							<div className="search-group">
								<input className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search amount or description" />
								<button className="search-btn">Search</button>
							</div>
						</div>
					</aside>

					<section className="right-panel">
						<div className="special-offers">
							<h4>Special Offers</h4>
							<div>
								{(rechargePacks.special || []).slice(0, 4).map(o => (
									<button key={o._id} className="offer-pill">₹{o.amount} · {o.description}</button>
								))}
							</div>
						</div>

						<div className="pack-categories">
							{displayCategories.map(cat => (
								<button key={cat} className={selectedCategory === cat ? 'cat active' : 'cat'} onClick={() => setSelectedCategory(cat)}>
									{cat.charAt(0).toUpperCase() + cat.slice(1)} <span className="count">{(rechargePacks[cat] || []).length}</span>
								</button>
							))}
						</div>

						<div className="packs-grid">
							{loading ? (
								<div className="loading">Loading plans…</div>
							) : (
								filteredPacks.length === 0 ? (
									<div className="empty">No plans match your search.</div>
								) : (
									filteredPacks.map(pack => (
										<article key={pack._id} className="pack-card">
											<header className="pack-card-header">
												<div className="pack-amount">{pack.amount}</div>
												<div className="pack-validity">{pack.validity || '—'}</div>
											</header>

											<div className="pack-details">
												<div className="pack-data">{pack.data || '—'}</div>
												<div className="pack-calls">{pack.calls || '—'}</div>
												<div className="pack-sms">{pack.sms || '—'}</div>
												<div className="pack-description">{pack.description}</div>
											</div>

											<footer className="pack-card-footer">
												<button className="recharge-btn" onClick={() => handleRecharge(pack)}>Recharge</button>
												<button className="details-btn nav-btn" onClick={() => alert(pack.description)}>Details</button>
											</footer>
										</article>
									))
								)
							)}
						</div>
					</section>
				</main>
			</div>
		);
};

export default BSNL;
