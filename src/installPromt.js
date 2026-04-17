let deferredPrompt;

export const initInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
};

export const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log('Install result:', outcome);
    deferredPrompt = null;
};