'use strict';
{
  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validateEmpty = (value) => value.length > 0;

  function drawError(input) {
    if(!input) return;

    const formWrapper = input.closest('.w-form');
    const errorElement = formWrapper.querySelector('.w-form-fail');

    errorElement.innerHTML = input.dataset.message;

    input.classList.add('invalid');
    errorElement.style.display = 'block';
  }

  function formValid(form) {
    const requiredFields = form.querySelectorAll('.required');
    let invalidField = null;
    const result = [...requiredFields].every((input) => {
      const { value, type } = input;
      let result = validateEmpty(value);
      input.classList.remove('invalid');

      if(type === 'email') result = validateEmail(value);

      if(!result) invalidField = input;
      return result;
    });

    drawError(invalidField);
    return result;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#email-form');

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formWrapper = form.closest('.w-form');
      const errorElement = formWrapper.querySelector('.w-form-fail');
      const successElement = formWrapper.querySelector('.w-form-done');
      errorElement.style.display = 'none';
      successElement.style.display = 'none';
      if(!formValid(form)) return;
      
      fetch('/edits/send/send_mail.php', {
          method: 'POST', 
          body: new FormData(form),
      })
        .then(response => response.json())
        .then((resp) => {
          const { result, status } = resp;
          const outputElem = result === 'success' ? successElement : errorElement;

          if(status) outputElem.innerHTML = status;
          outputElem.style.display = 'block';
        });
    });
  });
}