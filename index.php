<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="//unpkg.com/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <title>Document</title>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@500&display=swap');
    html, body {font-family: 'Exo 2', sans-serif;}
    </style>
</head>
<body>
    <div class="d-flex align-items-center justify-content-center" id="vantabg" style="height:100vh;">
        <div class="text-white text-center">
            <h1>{ Labscript.dev }</h1>
            <div class="mb-3"></div>
            <h3>Estaremos disponíveis em breve</h3>
            <div class="mb-4"></div>
            <a href="https://wa.me/message/NG7A2SW25XIEI1" target="_blank" class="mx-2" style="color:inherit;"><i class="fa-brands fa-whatsapp fa-2xl"></i></a>
            <a href="mailto:labscript.dev@gmail.com" target="_blank" class="mx-2" style="color:inherit;"><i class="fa-solid fa-envelope fa-2xl"></i></a>
            <a href="https://github.com/labscriptdev" target="_blank" class="mx-2" style="color:inherit;"><i class="fa-brands fa-github fa-2xl"></i></a>
        </div>
    </div>

    <?php $random = rand(0, 2); ?>

    <?php if ($random==0): ?>
    <script src="//unpkg.com/p5@1.4.1/lib/p5.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.trunk.min.js"></script>
    <script>
    VANTA.TRUNK({
    el: "#vantabg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff00ff,
        spacing: 10.00,
        chaos: 10.00
    });
    </script>

    <?php elseif ($random==1): ?>
    <script src="//cdnjs.cloudflare.com/ajax/libs/three.js/r119/three.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.net.min.js"></script>
    <script>
    VANTA.NET({
    el: "#vantabg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x0,
        points: 20.00,
        maxDistance: 25.00,
        spacing: 14.00
    });
    </script>
    
    
    <?php elseif ($random==2): ?>
    <script src="//cdnjs.cloudflare.com/ajax/libs/three.js/r119/three.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.globe.min.js"></script>
    <script>
    VANTA.GLOBE({
        el: "#vantabg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff00ff,
        color2: 0xff00ff,
        backgroundColor: 0x000000
    });
    </script>


    <?php endif; ?>
</body>
</html>