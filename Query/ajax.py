'''




from .dajaxice.utils import deserialize_form
from .models import query
from .dajax.core import Dajax
from .forms import query

@dajaxice_register
def send_form(request, form):
    dajax = Dajax()
    form = DreamrealForm(deserialize_form(form)) #JSON data lai deserialize garne
    if form.is_valid():
        dajax.remove_css_class('#form', 'error')
        dr = query() #create object getting data from form and save it to db
        dr.query_input= form.cleaned_data.get('address')
        dr.save()

        dajax.alert("Query submitted is %s and it was successfully saved." %
                    form.cleaned_data.get('address'))
    else:
        dajax.remove_css_class('#form', 'error')
        for error in form.errors:
            dajax.add_css_class('#id_%s' % error, 'error')
'''