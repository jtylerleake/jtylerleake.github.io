(function () {
	'use strict';

	const root = document.documentElement;
	const themeToggle = document.getElementById('theme-toggle');
	const yearEl = document.getElementById('year');
	const projectsLoading = document.getElementById('projects-loading');
	const projectsList = document.getElementById('projects-list');
	const githubUsername = document.body.getAttribute('data-github-username') || 'your-username';

	// Project image mapping - add your project images here
	const projectImages = {
		'racetrack-problem': 'assets/racetrack-car.png',
		'multilayer-perceptron-experiment': 'assets/neural-network.jpg',
		'task-adaptive-meta-model': 'assets/clustering.jpg',
		// Add more projects as needed: 'repo-name': 'assets/image-name.jpg'
	};

	function setYear() {
		if (yearEl) yearEl.textContent = String(new Date().getFullYear());
	}

	function initTheme() {
		try {
			const stored = localStorage.getItem('theme');
			if (stored === 'light' || stored === 'dark') {
				applyTheme(stored);
				return;
			}
			const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			applyTheme(prefersDark ? 'dark' : 'light');
		} catch (e) {
			applyTheme('light');
		}
	}

	function applyTheme(mode) {
		root.classList.remove('theme-light', 'theme-dark');
		root.classList.add(mode === 'dark' ? 'theme-dark' : 'theme-light');
		if (themeToggle) themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
		try { localStorage.setItem('theme', mode); } catch (e) {}
	}

	function toggleTheme() {
		const isDark = root.classList.contains('theme-dark');
		applyTheme(isDark ? 'light' : 'dark');
	}

	async function fetchAndRenderRepos() {
		if (!projectsList) return;
		const url = `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`;
		try {
			const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const repos = await res.json();
			const filtered = repos
				.filter(r => !r.fork && !r.archived)
				.filter(r => r.name.toLowerCase() !== `${githubUsername.toLowerCase()}.github.io`)
				.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
			renderRepos(filtered);
		} catch (err) {
			projectsLoading && (projectsLoading.textContent = 'Could not load projects right now.');
		}
	}

	function renderRepos(repos) {
		if (projectsLoading) projectsLoading.remove();
		if (!repos || repos.length === 0) {
			projectsList.innerHTML = '<p>No public projects yet.</p>';
			return;
		}
		const fragment = document.createDocumentFragment();
		repos.forEach(repo => {
			const card = document.createElement('article');
			card.className = 'project-card';
			
			// Add project image if available
			if (projectImages[repo.name]) {
				const imageContainer = document.createElement('div');
				imageContainer.className = 'project-image-container';
				const image = document.createElement('img');
				image.className = 'project-image';
				image.src = projectImages[repo.name];
				image.alt = `${repo.name} project image`;
				image.loading = 'lazy';
				imageContainer.appendChild(image);
				card.appendChild(imageContainer);
			}
			
			const title = document.createElement('h3');
			title.textContent = repo.name;
			const desc = document.createElement('p');
			desc.textContent = repo.description || 'No description provided.';
			const meta = document.createElement('div');
			meta.className = 'project-meta';
			const lang = document.createElement('span');
			lang.textContent = repo.language ? repo.language : '—';
			const stars = document.createElement('span');
			stars.textContent = `★ ${repo.stargazers_count}`;
			meta.appendChild(lang);
			meta.appendChild(stars);
			const links = document.createElement('div');
			links.className = 'project-links';
			const codeLink = document.createElement('a');
			codeLink.className = 'button button-ghost';
			codeLink.href = repo.html_url;
			codeLink.target = '_blank';
			codeLink.rel = 'noopener';
			codeLink.textContent = 'Code';
			links.appendChild(codeLink);
			if (repo.homepage) {
				const demoLink = document.createElement('a');
				demoLink.className = 'button';
				demoLink.href = repo.homepage;
				demoLink.target = '_blank';
				demoLink.rel = 'noopener';
				demoLink.textContent = 'Demo';
				links.appendChild(demoLink);
			}
			card.appendChild(title);
			card.appendChild(desc);
			card.appendChild(meta);
			card.appendChild(links);
			fragment.appendChild(card);
		});
		projectsList.innerHTML = '';
		projectsList.appendChild(fragment);
	}

	document.addEventListener('DOMContentLoaded', () => {
		setYear();
		initTheme();
		fetchAndRenderRepos();
	});

	if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
})();



