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
		'Racetrack-Problem' 				: 'assets/thumbnails/color/color-racecar-1.jpg',
		'Multilayer-Perceptron-Experiment'  : 'assets/thumbnails/color/color-mlpexp-1.jpg',
		'Modality-Informed-Metric-Learner'  : 'assets/thumbnails/color/color-mimml-1.jpg',
		'Computer-Vision-Trading-Agents'    : 'assets/thumbnails/light/light-traders-1.jpg',
	};

	// Language color mapping for the language bars
	function getLanguageColor(language) {
		const colors = {
			'Python': '#3572A5',
			'JavaScript': '#f1e05a',
			'TypeScript': '#2b7489',
			'HTML': '#e34c26',
			'CSS': '#563d7c',
			'Java': '#b07219',
			'C++': '#f34b7d',
			'C': '#555555',
			'C#': '#178600',
			'Go': '#00ADD8',
			'Rust': '#dea584',
			'PHP': '#4F5D95',
			'Ruby': '#701516',
			'Swift': '#ffac45',
			'Kotlin': '#F18E33',
			'Scala': '#c22d40',
			'R': '#198ce7',
			'MATLAB': '#e16737',
			'Julia': '#a270ba',
			'Shell': '#89e051',
			'PowerShell': '#012456',
			'Batchfile': '#C1F12E',
			'Dockerfile': '#384d54',
			'Makefile': '#427819',
			'Vue': '#41b883',
			'React': '#61dafb',
			'Angular': '#dd0031',
			'Node.js': '#339933',
			'Jupyter Notebook': '#DA5B0B',
			'Markdown': '#083fa1',
			'YAML': '#cb171e',
			'JSON': '#292b36',
			'XML': '#f0f0f0',
			'SQL': '#e48e00',
			'Assembly': '#6E4C13',
			'Fortran': '#4d41b1',
			'Lua': '#000080',
			'Perl': '#0298c3',
			'Objective-C': '#438eff',
			'Clojure': '#db5855',
			'Elixir': '#6e4a7e',
			'Erlang': '#B83998',
			'Haskell': '#5e5086',
			'OCaml': '#3be133',
			'F#': '#b845fc',
			'Dart': '#00B4AB',
			'Elm': '#60B5CC',
			'PureScript': '#1D222D',
			'Reason': '#ff5847',
			'Nim': '#ffc200',
			'Zig': '#ec915c',
			'V': '#4ac7c7',
			'Carbon': '#8f4e8b',
			'Mojo': '#ff4c29',
			'default': '#6f42c1'
		};
		return colors[language] || colors['default'];
	}

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
		if (themeToggle) themeToggle.textContent = mode === 'dark' ? 'Light' : 'Dark'; 
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
			
			// Fetch language data for each repo
			const reposWithLanguages = await Promise.all(
				filtered.map(async (repo) => {
					try {
						const langRes = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/languages`, {
							headers: { 'Accept': 'application/vnd.github+json' }
						});
						if (langRes.ok) {
							const languages = await langRes.json();
							repo.languages = languages;
						}
					} catch (e) {
						// If language fetch fails, continue without it
					}
					return repo;
				})
			);
			
			renderRepos(reposWithLanguages);
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
			
			const content = document.createElement('div');
			content.className = 'project-content';
			
			const title = document.createElement('h3');
			title.className = 'project-title';
			title.textContent = repo.name;
			content.appendChild(title);
			
			const desc = document.createElement('p');
			desc.className = 'project-description';
			desc.textContent = repo.description || 'No description provided.';
			content.appendChild(desc);
			
			const links = document.createElement('div');
			links.className = 'project-links';
			const codeLink = document.createElement('a');
			codeLink.className = 'button button-ghost';
			codeLink.href = repo.html_url;
			codeLink.target = '_blank';
			codeLink.rel = 'noopener';
			codeLink.textContent = 'Repository';
			links.appendChild(codeLink);
			
			// Add language breakdown bar to the right of the Repository button
			if (repo.languages && Object.keys(repo.languages).length > 0) {
				const langBreakdown = document.createElement('div');
				langBreakdown.className = 'language-breakdown';
				langBreakdown.style.marginLeft = '12px';
				langBreakdown.style.display = 'flex';
				langBreakdown.style.alignItems = 'center';
				langBreakdown.style.gap = '8px';
				
				// Create the language bar
				const langBar = document.createElement('div');
				langBar.className = 'language-bar';
				langBar.style.display = 'flex';
				langBar.style.height = '8px';
				langBar.style.width = '60px';
				langBar.style.borderRadius = '4px';
				langBar.style.overflow = 'hidden';
				langBar.style.backgroundColor = 'var(--border)';
				
				// Calculate total bytes and create colored segments
				const totalBytes = Object.values(repo.languages).reduce((sum, bytes) => sum + bytes, 0);
				Object.entries(repo.languages).forEach(([lang, bytes]) => {
					const percentage = (bytes / totalBytes) * 100;
					const segment = document.createElement('div');
					segment.style.width = `${percentage}%`;
					segment.style.height = '100%';
					segment.style.backgroundColor = getLanguageColor(lang);
					langBar.appendChild(segment);
				});
				
				// Create language labels
				const langLabels = document.createElement('span');
				langLabels.style.fontSize = '11px';
				langLabels.style.color = 'var(--muted)';
				langLabels.style.whiteSpace = 'nowrap';
				
				const languageList = Object.entries(repo.languages)
					.map(([lang, bytes]) => {
						const percentage = Math.round((bytes / totalBytes) * 100);
						return `${lang} ${percentage}%`;
					})
					.join(', ');
				
				langLabels.textContent = languageList;
				
				langBreakdown.appendChild(langBar);
				langBreakdown.appendChild(langLabels);
				links.appendChild(langBreakdown);
			}
			if (repo.homepage) {
				const demoLink = document.createElement('a');
				demoLink.className = 'button';
				demoLink.href = repo.homepage;
				demoLink.target = '_blank';
				demoLink.rel = 'noopener';
				demoLink.textContent = 'Demo';
				links.appendChild(demoLink);
			}
			content.appendChild(links);
			
			card.appendChild(content);
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


