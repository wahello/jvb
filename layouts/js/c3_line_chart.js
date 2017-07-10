"use strict";
$(document).ready(function () {
    // function c3_resize(){


//         ==========================   line chart=============================
        var chart1 = c3.generate({
            bindto: '#line_chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 30, 20, 35, 15, 25]
                ]
            },
            color: {
                pattern: ['#329cff','#5aca82','#007bb8','#fcb410']
            },
            grid: {
                y: {
                    show: true
                }
            },
               axis: {
                x: {
                    type: 'category',
                    categories: ['A', 'B', 'C', 'D', 'F']
                }
            }
            // axis:{
            //     y: {
            //         type:'category',
            //         categories:['8.1','2.4','5.5','8.4']
            //     }
            // }

        });

        setTimeout(function () {
            chart1.load({
                columns: [
                    ['data1', 230, 190, 300, 500, 300, 400]
                ]
            });
        }, 800);

        setTimeout(function () {
            chart1.load({
                columns: [
                    ['data3', 130, 100, 200, 300, 200, 100]
                ]
            });
        }, 1200);

        setTimeout(function () {
            chart1.unload({
                ids: 'data1'
            });
        }, 1500);


//           ============================= End of line chart=========================
});