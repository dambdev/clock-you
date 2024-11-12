import App from './App.jsx';
import Modal from 'react-modal';
import { Toaster } from 'react-hot-toast';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
<<<<<<< HEAD
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position='top-center'
                    toastOptions={{
                        duration: 7000,
                        style: {
                            backgroundColor: 'var(--cerulean)',
                            color: 'var(--white-color)',
                            borderRadius: '100px',
                            textAlign: 'center',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
=======
    <BrowserRouter>
        <AuthProvider>
            <App />
            <Toaster
                position='top-center'
                toastOptions={{
                    duration: 7000,
                    style: {
                        backgroundColor: 'var(--cerulean)',
                        color: 'var(--white-color)',
                        borderRadius: '100px',
                        textAlign: 'center',
                    },
                }}
            />
        </AuthProvider>
    </BrowserRouter>
>>>>>>> 48db32d692f95f1d7e124bc46f8d7250988200d7
);
