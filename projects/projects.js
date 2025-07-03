// ===== Exports needed by projects.js =====
export async function fetchJSON(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.statusText}`);
      return await resp.json();
    } catch (err) {
      console.error(err);
    }
  }
  
  export function renderProjects(projects, container, headingLevel = 'h2') {
    container.innerHTML = '';
    for (const project of projects) {
      const article = document.createElement('article');
      const titleHTML = project.url
        ? `<a href="${project.url}" target="_blank">${project.title}</a>`
        : project.title;
  
      article.innerHTML = `
        <div class="project-card">
          <${headingLevel}>${titleHTML}</${headingLevel}>
          <img src="${project.image}" alt="${project.title}">
          <p class="project-year"><em>${project.year}</em></p>
          <p class="project-description">${project.description}</p>
        </div>
      `;
      container.append(article);
    }
  }
  // ===== end exports =====
  




  import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
  
  let selectedLabel = null;
  let hoveredLabel  = null;
  let query         = '';
  
  // Load project data
  const projects  = await fetchJSON('./lib/projects.json');
  const container = document.querySelector('.projects');
  const search    = document.querySelector('.searchBar');
  const svg       = d3.select('#projects-pie-plot');
  const legend    = d3.select('.legend');
  
  // Aggregate counts by year
  const aggregated = d3.rollups(
    projects,
    v => v.length,
    d => d.year
  ).map(([label, value]) => ({ label, value }));
  
  // Pastel color scale
  const colorScale = d3.scaleOrdinal(d3.schemePastel1);
  
  // Pie & arc generators
  const pieGen = d3.pie().value(d => d.value);
  const arcGen = d3.arc().innerRadius(0).outerRadius(50);
  
  // Main update function
  function updateDisplay() {
    // 1) Filter & render cards
    const filtered = projects.filter(p => {
      const txt    = Object.values(p).join(' ').toLowerCase();
      const matchQ = txt.includes(query);
      const matchY = !selectedLabel || p.year === selectedLabel;
      return matchQ && matchY;
    });
    renderProjects(filtered, container);
  
    // 2) Re-bind full pie data
    const arcs = pieGen(aggregated);
  
    // JOIN enter + update + exit properly
    const slices = svg.selectAll('path').data(arcs, d => d.data.label);
  
    // EXIT: remove slices ONLY if truly gone (never here)
    slices.exit().remove();
  
    // ENTER: append new slices if needed
    const enter = slices.enter()
      .append('path')
        .on('click',   (_, d) => {
          selectedLabel = selectedLabel === d.data.label ? null : d.data.label;
          updateDisplay();
        })
        .on('mouseover',(_, d) => {
          hoveredLabel = d.data.label;
          updateDisplay();
        })
        .on('mouseout', () => {
          hoveredLabel = null;
          updateDisplay();
        });
  
    // ENTER + UPDATE: draw & style all slices
    enter.merge(slices)
      .attr('d', arcGen)
      .attr('fill', (_, i) => colorScale(i))
      .attr('opacity', d => {
        if (hoveredLabel)  return d.data.label === hoveredLabel  ? 1 : 0.5;
        if (selectedLabel) return d.data.label === selectedLabel ? 1 : 0.5;
        return 1;
      })
      .style('cursor', 'pointer');
    
    // 3) Legend (similar join)
    const items = legend.selectAll('li').data(aggregated, d => d.label);
    items.exit().remove();
    
    const itemsEnter = items.enter()
      .append('li')
        .on('click', (_, d) => {
          selectedLabel = selectedLabel === d.label ? null : d.label;
          updateDisplay();
        });
  
    itemsEnter.merge(items)
      .attr('style', (_, i) => `--color:${colorScale(i)}`)
      .classed('selected', d => d.label === selectedLabel)
      .html(d => `<span class="swatch"></span> ${d.label} (${d.value})`);
  }
  
  // Initial render
  updateDisplay();
  
  // Search listener
  search.addEventListener('input', e => {
    query = e.target.value.toLowerCase();
    selectedLabel = null;
    updateDisplay();
  });
  