window.onload = function() {
    const divisor = 15; //15 Particles per horizontal pixel in the viewport

    function calculateMaxParticles(hor) {
        return Math.round(hor / divisor);
    }

    Particles.init({
        selector: '.particles', //Canvas Element in DOM
        color: '#ffffff', //Default #000000
        maxParticles: '110', //Default 100
        connectParticles: 'true',
        speed: 0.3, //Default 0.5

        //Responsiveness
        responsive: [
            {
                breakpoint: 1920,
                options: {
                    maxParticles: calculateMaxParticles(1920)
                }
            },
            {
                breakpoint: 1720,
                options: {
                    maxParticles: calculateMaxParticles(1720)
                }
            },
            {
                breakpoint: 1520,
                options: {
                    maxParticles: calculateMaxParticles(1520)
                }
            },
            {
                breakpoint: 1320,
                options: {
                    maxParticles: calculateMaxParticles(1320)
                }
            },
            {
                breakpoint: 1120,
                options: {
                    maxParticles: calculateMaxParticles(1120)
                }
            },
            {
                breakpoint: 920,
                options: {
                    maxParticles: calculateMaxParticles(920)
                }
            },
            {
                breakpoint: 720,
                options: {
                    maxParticles: calculateMaxParticles(720)
                }
            },
            {
                breakpoint: 520,
                options: {
                    maxParticles: calculateMaxParticles(520)
                }
            },
            {
                breakpoint: 320,
                options: {
                    maxParticles: calculateMaxParticles(320)
                }
            }
        ]

    });
};