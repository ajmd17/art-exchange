import * as React from 'react';

import IntroHeader from './screens/IntroHeader';
import IntroNav from './screens/IntroNav';
import HowItWorks from './screens/HowItWorks';
import FaqSection from './screens/FaqSection';
import Roadmap from './screens/Roadmap';
import Footer from './screens/Footer';

class ProductLanding extends React.Component {
  render() {
    return (
      <div className='product-landing'>
        <div className='vignette'>
          <IntroNav/>
          <IntroHeader/>
        </div>
        <HowItWorks/>
        <Roadmap/>
        <Footer/>
      </div>
    );
  }
}

export default ProductLanding;
