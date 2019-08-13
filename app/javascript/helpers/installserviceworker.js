export const register = (resolve) => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service_worker.js')
    .then(function(reg) {
      console.log('Registered, installserviceworker.js');
    })
  }
  else{
    console.error('Service worker is not supported in this browser');
  }
}
