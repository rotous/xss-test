window.addEventListener('load', function() {
	const form = document.getElementById('form');
	const formParams = document.getElementById('form-params');
	const nameInput = document.getElementById('name');
	const methodSelect = document.getElementById('method');
	const urlInput = document.getElementById('url');
	const submitButton = document.getElementById('submit');
	const saveButton = document.getElementById('save');
	const loadButton = document.getElementById('load');
	const resetButton = document.getElementById('reset');
	const addButton = document.getElementById('add-param');
	const paramListWrapper = document.getElementById('params-wrapper');
	const paramList = document.getElementById('params');
	const loadDialog = document.getElementById('load-dialog');
	const loadDialogCancelButton = document.getElementById('load-dialog-cancel');

	addButton.addEventListener('click', function(e) {
		addParamField();
	});

	submitButton.addEventListener('click', function(e) {
		if (urlInput.value === '') {
			return alert('Please fill in a URL');
		}

		form.method = methodSelect.value;
		form.action = urlInput.value;

		let html = '';
		Array.prototype.forEach.call(paramList.querySelectorAll('.item'), function(item) {
			const key = item.querySelector('.param-key');
			const val = item.querySelector('.param-value');
			console.log(key.value + ' => ' + val.value)
			if (typeof key.value === 'string' && key.value.length > 0) {
//				html += '<input type="hidden" name="' + key.value + '" value="' + encodeURIComponent(val.value) + '" />';
				html += '<input type="hidden" name="' + key.value + '" value="' + val.value.replace('"', '&quot;') + '" />';
			}
		});
		formParams.innerHTML = html;

		form.submit();
	});

	saveButton.addEventListener('click', saveForm);
	loadButton.addEventListener('click', showLoadFormDialog);
	resetButton.addEventListener('click', resetForm);
	loadDialogCancelButton.addEventListener('click', function() {loadDialog.close()});

	function addParamField(key, value) {
		paramListWrapper.classList.remove('hidden');
		key = key || '';
		value = value || '';
		const item = document.createElement('div');
		item.classList.add('item');
		item.innerHTML =
			'<input class="param-key" placeholder="Key" value="' + key.replace('"', '&quot;') + '"/>' +
			'<input class="param-value" placeholder="value" value="' + value.replace('"', '&quot;') + '" />' +
			'<button type="button" class="remove">Remove</button>';

		const node = paramList.insertBefore(item, paramList.lastChild);
		node.querySelector('button.remove').addEventListener('click', function() {item.remove();});
	}

	function removeAllParamFields() {
		paramListWrapper.classList.add('hidden');
		Array.prototype.forEach.call(paramList.querySelectorAll('.item'), function(item) {
			item.remove();
		});
	}

	function getSavedForms() {
		let forms = localStorage.getItem('forms');
		try {
			forms = JSON.parse(forms);
		} catch (e) {
			console.error('Bad json in localstorage');
			return [];
		}

		return forms || [];
	}

	function getSavedFormIndexByName(name) {
		if (typeof name !== 'string' || name.length === 0) {
			return false;
		}

		name = name.toLowerCase();
		let formIndex = false;
		let forms = getSavedForms();
		forms.some(function(f, index) {
			if (f.name === name) {
				formIndex = index;
				return true;
			}
			return false;
		});

		return formIndex;
	}

	function loadFormByName(name) {
		const forms = getSavedForms();
		const formIndex = getSavedFormIndexByName(name);
		if (formIndex === false) {
			alert('Form ' + name + ' not found');
			return;
		}

		nameInput.value = forms[formIndex].name;
		methodSelect.value = forms[formIndex].method;
		urlInput.value = forms[formIndex].url;
		removeAllParamFields();
		forms[formIndex].params.forEach(function(param) {
			addParamField(param.key, param.value);
		});
	}

	function saveForm() {
		const name = nameInput.value;
		if (name.length === 0) {
			alert('Please fill in a name for the form');
			return;
		}
		const forms = getSavedForms();
		let formIndex = getSavedFormIndexByName(name);
		if (formIndex !== false) {
			const overwrite = confirm('Overwrite ' + name + '?');
			if (!overwrite) {
				return;
			}
		}

		const params = [];
		Array.prototype.forEach.call(paramList.querySelectorAll('.item'), function(item) {
			const key = item.querySelector('.param-key');
			const val = item.querySelector('.param-value');
			console.log(key.value + ' => ' + val.value)
			if (typeof key.value === 'string' && key.value.length > 0) {
				params.push({
					key: key.value,
					value: val.value,
				});
			}
		});

		let form = {
			name: nameInput.value,
			method: methodSelect.value,
			url: urlInput.value,
			params: params,
		};

		if (formIndex === false) {
			forms.push(form);
		} else {
			forms[formIndex] = form;
		}

		localStorage.setItem('forms', JSON.stringify(forms));
	}

	function showLoadFormDialog() {
		const forms = getSavedForms();
		if (forms.length === 0) {
			alert('No forms found');
			return;
		}

		const list = loadDialog.querySelector('ul');
		list.innerHTML = '';

		forms.forEach(function(form) {
			const li = document.createElement('li');
			li.innerHTML = form.name;
			list.appendChild(li);
			li.addEventListener('click', function() {
				loadFormByName(form.name);
				loadDialog.close();
			});
		});

		loadDialog.showModal();
	}

	function resetForm() {
		if (!confirm('Reset form. Are you sure?')) {
			return;
		}

		removeAllParamFields();
		nameInput.value = '';
		methodSelect.value = 'GET';
		urlInput.value = '';
	}
});
