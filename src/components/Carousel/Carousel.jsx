import React from 'react'
import './Carousel.css'
import banner1 from '../../assets/banner1.png'
import banner2 from '../../assets/banner2.png'
import banner3 from '../../assets/banner3.png'
import banner4 from '../../assets/banner4.png'

function Carousel() {
    return (
        <>
            <div class="slider-container">
                <div class="slider">
                    <div class="slide">
                        <img src={banner1} alt="Imagen 1" />
                        <div class="slide-content">
                            <h3>Tochi</h3>
                            <p>Disfruta de lo más hermosos del mundo.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner2} alt="Imagen 2" />
                        <div class="slide-content">
                            <h3>Ofertas</h3>
                            <p>Explora las ofertas más impresionantes.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner3}alt="Imagen 3" />
                        <div class="slide-content">
                            <h3>Estilo de vida</h3>
                            <p>Relájate pensando en tí.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner4} alt="Imagen 4" />
                        <div class="slide-content">
                            <h3>Fresco</h3>
                            <p>Descubre la frescura de nuestros productos.</p>
                        </div>
                    </div>
                </div>

                <div class="slider-dots">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </>
    )
}

export default Carousel