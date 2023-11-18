---
date: 2018-11-28T15:14:39+10:00
---

{{< rawhtml >}}

<style>
    .box-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        font-family: Arial, sans-serif;
    }

    .box {
        cursor: pointer;
        width: 300px;
        height: 120px;
        margin: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 2px solid #4f4fde;
        border-radius: 10px;
        padding: 15px;
        text-align: left;
        background-color: #fff;
        transition: background-color 0.3s;
    }

    .box:hover {
        background-color: #f0f0f0;
    }

    .box h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 400;
    }

    .box p {
        margin: 0;
        font-size: 14px;
        color: #4f4fde;
    }
</style>

<div class="box-container">
    <div class="box">
        <div>
            <h2 sytle="fontWeight: bold">Documentation</h2>
            <p>Explore our documentation</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

    <div class="box">
        <div>
            <h2>Whitepaper</h2>
            <p>Rationale behind Morty</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

      <div class="box">
        <div>
            <h2>Pitch Deck</h2>
            <p>Reasons to choose Morty</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

      <div class="box">
        <div>
            <h2>Brand Bible</h2>
            <p>What our brand looks like</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const boxes = document.querySelectorAll('.box');
        
        // TODO: use mortystack/docs instead
        boxes[0].addEventListener('click', function() {
            window.location.href = '/docs';
        });

          boxes[1].addEventListener('click', function() {
            window.location.href = 'https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/MORTYSTACK_WHITEPAPER.pdf?alt=media&token=c0959e3c-0a07-4132-8af8-357e8a67d2f4';
        });


          boxes[2].addEventListener('click', function() {
            window.location.href = 'https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/MortyStack_Pitchdeck.pdf?alt=media&token=b7c30e81-6645-4d1f-9104-0ad25cfe7c30';
        });


          boxes[3].addEventListener('click', function() {
            window.location.href = 'https://firebasestorage.googleapis.com/v0/b/mortywalletng.appspot.com/o/Morty_Brand_Bible.pdf?alt=media&token=f5a43961-8a19-44c8-aef1-d006501838e5';
        });


        boxes.forEach(box => {
            box.addEventListener('mouseover', () => {
                box.style.backgroundColor = '#f0f0f0';
            });
            box.addEventListener('mouseout', () => {
                box.style.backgroundColor = '#fff';
            });
        });
    });
</script>

</div>

{{< /rawhtml >}}
