export function applyRowAlert(rowEl, row) {
  const isFailed = row.project_status === 'Failed';
  const isNegativeRoi = Number(row.roi_percent) < 0;

  const lastState = rowEl.dataset.alertState;
  const currentState = isFailed ? 'failed' : (isNegativeRoi ? 'negative' : 'normal');

  if (lastState !== currentState) {
    rowEl.dataset.alertState = currentState;
    
    // Remove both classes first
    rowEl.classList.remove('row-flash-alert', 'row-flash-warn');
    
    if (isFailed) {
      void rowEl.offsetWidth; // Force reflow to trigger CSS animation restart
      rowEl.classList.add('row-flash-alert');
    } else if (isNegativeRoi) {
      void rowEl.offsetWidth; // Force reflow to trigger CSS animation restart
      rowEl.classList.add('row-flash-warn');
    }
  }
}
