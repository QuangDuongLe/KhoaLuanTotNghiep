import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Kiểm tra xem đường dẫn có chứa "/not-found" hay không
  const isNotFoundPage = location.pathname.includes('/not-found');

  if (isNotFoundPage) {
    // Trả về null nếu là trang "NotFoundPage" (ẩn footer)
    return null;
  }
  return (
    <div>
      <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
        <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
          <div className='me-5 d-none d-lg-block'>
            <span style={{ color: 'gray', fontWeight: 'bold' }}>Hãy liên hệ với chúng tôi qua:</span>
          </div>
        </section>
        <section className=''>
          <MDBContainer className='text-center text-md-start mt-5'>
            <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>
                  <MDBIcon icon="gem" className="me-3" />
                  DIDONGGENZ
                </h6>
                <p>
                  "Tận hưởng sự đột phá với DidongGenz - Hành trình vượt bậc vào thế giới công nghệ di động của chúng tôi!"
                </p>
                <p>
                  <MDBIcon icon="envelope" className="me-3" />
                  didonggenz@gmail.com
                </p>
                <p>
                  <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
                </p>
              </MDBCol>

              <MDBCol md="6" lg="4" xl="6" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>ĐỊA CHỈ</h6>
                <div style={{ height: '200px', width: '100%' }}>
                  <iframe
                    title="Bản đồ"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4797040213584!2d106.77103157505007!3d10.851072057812377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752774d7e357c3%3A0x7cc744cb226ad64!2zc-G7kSAxIFbDtSBWxINuIE5nw6JuLCBMaW5oIENoaeG7g3UsIFRo4bunIMSQ4bupYywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1698757539263!5m2!1svi!2"
                    width="100%"
                    height="100%"
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>

        <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          © 2023 Copyright:
          <a className='text-reset fw-bold' href='/'>
            DiDongGenZ.com
          </a>
        </div>
      </MDBFooter>
    </div >
  )
}

export default Footer