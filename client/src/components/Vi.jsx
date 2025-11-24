// Vi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vi.css';
import './Operator.css';
import ViLogo from './vi-logo.svg';
import api from '../utils/api';
import LoadingSkeleton from './LoadingSkeleton';
import { z } from 'zod';
import { toast } from '../utils/toast';

const Vi = ({ isAuthenticated, currentUser, onRechargeInitiate }) => {
	const [mobileNumber, setMobileNumber] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('recommended');
	const [operator, setOperator] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fallbackPlans = {
		name: 'Vi',
		_id: 'vi-fallback',
		plans: [
			{ _id: 'v-r1', amount: 99, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Popular value monthly' },
			{ _id: 'v-r2', amount: 149, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Recommended for streaming' },
			{ _id: 'v-r3', amount: 199, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', description: 'Two-month saver' },
			{ _id: 'v-u1', amount: 249, validity: '30 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Unlimited monthly' },
			{ _id: 'v-u2', amount: 399, validity: '90 days', data: 'Unlimited (FUP)', calls: 'Unlimited', sms: '100/day', description: 'Quarterly unlimited' },
			{ _id: 'v-e1', amount: 349, validity: '30 days', data: '3GB/day', calls: 'Unlimited', sms: '100/day', description: 'Entertainment pack with OTT' },
			{ _id: 'v-m1', amount: 119, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', description: 'Basic monthly plan' },
			{ _id: 'v-y1', amount: 1299, validity: '365 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', description: 'Yearly value pack' },
			{ _id: 'v-ro1', amount: 2599, validity: '30 days', data: '8GB roaming', calls: 'International', sms: '-', description: 'Roaming starter' },
			{ _id: 'v-off1', amount: 49, validity: '7 days', data: '500MB/day', calls: '50 min', sms: '-', description: 'Intro offer' }
		]
	};

	useEffect(()=>{ if(!isAuthenticated) navigate('/login'); },[isAuthenticated,navigate]);

	useEffect(()=>{
			const fetchOp=async()=>{
				setLoading(true);
				try{
					const res = await api.get('/api/v1/operators');
					const json = res?.data?.data || res?.data || [];
					const ops = json;
					const found = Array.isArray(ops) ? ops.find(o => o.name === 'Vi') : null;
					setOperator(found || fallbackPlans);
				} catch (e) {
					setOperator(fallbackPlans);
				} finally { setLoading(false); }
			};
			fetchOp();
		},[]);

	const categorizePlans = (plans) => {
		if(!plans) return {};
		const categorized={recommended:[],unlimited:[],entertainment:[],monthly:[],yearly:[],roaming:[],special:[],all:plans};
		plans.forEach(plan=>{ const amt=Number(plan.amount); const desc=(plan.description||'').toLowerCase(); const dataStr=(plan.data||'').toLowerCase(); if(plan._id&&plan._id.includes('off')) categorized.special.push(plan); if([99,119,149].includes(amt)) categorized.recommended.push(plan); if(desc.includes('unlimited')||dataStr.includes('unlimited')) categorized.unlimited.push(plan); if(desc.includes('ott')||desc.includes('entertain')||desc.includes('streaming')||(amt>=300&&amt<800)) categorized.entertainment.push(plan); if(amt<300&&plan.validity&&(plan.validity.includes('28')||plan.validity.includes('56')||plan.validity.includes('30'))) categorized.monthly.push(plan); if(plan.validity&&plan.validity.includes('365')) categorized.yearly.push(plan); if(desc.includes('roam')||desc.includes('international')||amt>=2000) categorized.roaming.push(plan); });
		return categorized;
	};

	const rechargePacks = operator ? categorizePlans(operator.plans) : {};
	const filteredPacks = rechargePacks[selectedCategory] ? rechargePacks[selectedCategory].filter(pack=> pack.amount.toString().includes(searchQuery) || (pack.description||'').toLowerCase().includes(searchQuery.toLowerCase())) : [];
	const displayCategories = ['recommended','unlimited','entertainment','monthly','yearly','roaming','special','all'];

	const handleRecharge = (pack) => {
		const schema = z.object({ mobileNumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number') });
		const v = schema.safeParse({ mobileNumber });
		if (!v.success) { toast.error(v.error.errors[0].message); return; }
		const rechargeDetails = { ...pack, mobileNumber, operator: 'Vi', operatorId: operator?._id, planId: pack._id };
		if (typeof onRechargeInitiate === 'function') onRechargeInitiate(rechargeDetails);
		navigate('/payment', { state: rechargeDetails });
	};

		if (!isAuthenticated) return null;

		return (
			<div className="operator-page vi-page">
				<header className="operator-navbar">
					<div className="navbar-container">
						<div className="operator-logo">
							<img src={ViLogo} alt="Vi" />
							<div className="operator-meta">
								<div className="operator-title">Vi</div>
								<div className="operator-sub">Prepaid · Postpaid · Broadband</div>
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
								<LoadingSkeleton rows={6} height={80} />
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

export default Vi;
