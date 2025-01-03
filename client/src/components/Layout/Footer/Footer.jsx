const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer>
            <div className='py-6 text-center'>
                <p>&copy; ClockYou {year}</p>
            </div>
        </footer>
    );
};

export default Footer;
