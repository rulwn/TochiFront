import React from 'react'
import './Carousel.css'
import banner from '../../assets/banner.png'
function Carousel() {
    return (
        <>
            <div class="slider-container">
                <div class="slider">
                    <div class="slide">
                        <img src={banner} alt="Imagen 1" />
                        <div class="slide-content">
                            <h3>Naturaleza</h3>
                            <p>Disfruta de los paisajes más hermosos del mundo.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner} alt="Imagen 2" />
                        <div class="slide-content">
                            <h3>Ciudades</h3>
                            <p>Explora las metrópolis más impresionantes.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner}alt="Imagen 3" />
                        <div class="slide-content">
                            <h3>Playas</h3>
                            <p>Relájate en las playas más paradisíacas.</p>
                        </div>
                    </div>

                    <div class="slide">
                        <img src={banner} alt="Imagen 4" />
                        <div class="slide-content">
                            <h3>Montañas</h3>
                            <p>Descubre las cumbres más altas del planeta.</p>
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