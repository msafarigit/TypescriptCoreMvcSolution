var jqtest = {
    showMsg: function (): void {
        let v: any = jQuery.fn.jquery.toString();
        let content: any = $("#ts-example-2")[0].innerHTML;
        //alert(content.toString());
        $("#ts-example-2")[0].innerHTML = content + " " + v + "!!";
    }
};

jqtest.showMsg();

/*
  1- Integrate Jquery using "typing" (TS version 2.0)
  2- Integrate Jquery using "@types" (TS version 2.0+)
  3- Refer Jquery directly in html
*/