// app/page.js
import Image from 'next/image';

export default function ComingSoon() {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            backgroundColor: '#000', // Black background, change as needed
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                    src="/assets/DBW-MESSAGE.png"
                    alt="Coming Soon"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>
        </div>
    );
}