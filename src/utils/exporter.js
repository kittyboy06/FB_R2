export function exportSnapshot(pool) {
  if (!pool || pool.length === 0) return;

  const headers = [
    'project_id',
    'company_id',
    'project_name',
    'start_date',
    'completion_date',
    'project_status',
    'automation_type',
    'robots_deployed',
    'budget_usd',
    'annual_savings_usd',
    'roi_percent',
    'department',
    'implementation_partner',
    'country',
    'industry',
    'employee_hours_saved',
    'ai_enabled',
    'cloud_deployment'
  ];

  const workerCode = `
    self.onmessage = function(e) {
      const { pool, headers } = e.data;
      
      const escapeValue = (val) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      let csvText = headers.join(',') + '\\n';
      
      for (let i = 0; i < pool.length; i++) {
        const row = pool[i];
        const line = headers.map(h => escapeValue(row[h])).join(',');
        csvText += line + '\\n';
      }

      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      self.postMessage(blob);
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  const worker = new Worker(workerUrl);

  worker.onmessage = (e) => {
    const downloadBlob = e.data;
    const url = URL.createObjectURL(downloadBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rpa_snapshot_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(workerUrl);
    worker.terminate();
  };

  worker.postMessage({ pool, headers });
}
