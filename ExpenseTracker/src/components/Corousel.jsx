import React from 'react'
import i1 from '../assets/qw1.jpg'
import i2 from '../assets/qw.jpg'
import i3 from '../assets/qw2.jpg'
import '../App.css'


function Corousel() {
  return (
    <div id="coro">
        <div id="carouselExample" class="carousel slide">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src={i3} class="d-block" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={i2} class="d-block" alt="..."/>
    </div>
    <div class="carousel-item">
      <img src={i1} class="d-block" alt="..."/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
    </div>
  )
}

export default Corousel