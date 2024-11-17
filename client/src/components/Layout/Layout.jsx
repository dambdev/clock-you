import Footer from './Footer/Footer';
import Header from './Header/Header';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};
