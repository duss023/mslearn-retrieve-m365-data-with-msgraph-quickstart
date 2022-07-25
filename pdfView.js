        /**
         * VIEW PDF
         */
         var pdfUrl =  '';

         // Loaded via <script> tag, create shortcut to access PDF.js exports.
         var pdfjsLib = window['pdfjs-dist/build/pdf'];
 
         // The workerSrc property shall be specified.
         pdfjsLib.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js';
 
         var pdfDoc = null,
             pageNum = 1,
             pageRendering = false,
             pageNumPending = null,
             scale = 1.5,
             canvas = document.getElementById('canvas'),
             ctx = canvas.getContext('2d');
             canvas2 = document.getElementById('canvas2'),
             ctx2 = canvas2.getContext('2d');
             ctx2.imageSmoothingEnabled = false;
         function renderPage(num) {
             pageRendering = true;
             // Using promise to fetch the page
             pdfDoc.getPage(num).then(function(page) {
                 var viewport = page.getViewport({scale: scale});
                 canvas.height = viewport.height;
                 canvas.width = viewport.width;
                 canvas2.height = viewport.height;
                 canvas2.width = viewport.width;
                 // Render PDF page into canvas context
                 var renderContext = {
                   canvasContext: ctx,
                   viewport: viewport
                 };
                 var renderTask = page.render(renderContext);
 
                 // Wait for rendering to finish
                 renderTask.promise.then(function() {
                   pageRendering = false;
                   if (pageNumPending !== null) {
                       // New page rendering is pending
                       renderPage(pageNumPending);
                       pageNumPending = null;
                   }
                 });
             });
 
             // Update page counters
             document.getElementById('page_num').textContent = num;
         }
 
         function queueRenderPage(num) {
             if (pageRendering) {
                 pageNumPending = num;
             } else {
                 renderPage(num);
             }
         }
 
         function onPrevPage() {
             if (pageNum <= 1) {
                 return;
             }
             pageNum--;
             queueRenderPage(pageNum);
         }
         document.getElementById('prev').addEventListener('click', onPrevPage);
 
         function onNextPage() {
             if (pageNum >= pdfDoc.numPages) {
                 return;
             }
             pageNum++;
             queueRenderPage(pageNum);
         }
         document.getElementById('next').addEventListener('click', onNextPage);
 
         var request = new XMLHttpRequest();
         var target;
         request.open( "GET", URL, true );
         request.send(null);
         request.onreadystatechange = function(){
             if(request.readyState == 4){
                 if(request.status == 200){
                     target = request.responseText;
                 }
             }
         }
     
         async function viewPdf () {
            pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;
                document.getElementById('page_count').textContent = pdfDoc.numPages;
    
                // Initial/first page rendering
                renderPage(pageNum);
            });
        }