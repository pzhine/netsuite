import json
import requests


class Netsuite(object):
    # URL for crud operations restlet: GET, POST, PUT, DELETE
    CRUD_URL = ('https://rest.netsuite.com/app/site/hosting/restlet.nl?'
                'script=6&deploy=1')

    # URL for search operations
    SEARCH_URL = ('https://rest.netsuite.com/app/site/hosting/restlet.nl'
                  '?script=7&deploy=1')

    CHANGE_STATUS_URL = ('https://rest.netsuite.com/app/site/hosting/restlet.nl'
                '?script=15&deploy=1')

    TRANSFORM_URL = ('https://rest.netsuite.com/app/site/hosting/restlet.nl'
                '?script=16&deploy=1')


    def __init__(self, email, password, account):
        self.email = email
        self.password = password
        self.account = account

        self.headers = {
            'Authorization': 'NLAuth nlauth_email=%s, nlauth_signature=%s, '
            'nlauth_account=%s' % (self.email, self.password, self.account),
            'content-type': 'application/json',
        }

        self.session = requests.Session()

    def _get(self, url, params):
        r = self.session.get(url, params=params, headers=self.headers)
        #r = requests.get(url, params=params, headers=self.headers)
        return json.loads(r.content)

    def _post(self, url, params):
        r = self.session.post(url, data=json.dumps(params), headers=self.headers)
        #r = requests.post(url, data=json.dumps(params), headers=self.headers)
        return json.loads(r.content)

    def _delete(self, url, recordtype, entity_id):
        r = self.session.delete(url, params={'recordtype': recordtype, 'id': entity_id}, headers=self.headers)
        #r = requests.delete(url, params={'recordtype': recordtype, 'id': entity_id}, headers=self.headers)
        return r.content

    def _put(self, url, params):
        # TODO: create restlet which performs a PUT (or update)
        pass

    def fulfill_salesorder_items(self, salesorder_id, line_items):
        return self.create_child_record('salesorder',
                                         salesorder_id,
                                         'itemfulfillment',
                                         line_items)

        #return self._post(self.FULFILLMENT_URL, params)

    def close_record(self, record_type, record_id):
        params = {
            'record_type': record_type,
            'record_id': record_id,
        }
        return self._post(self.CHANGE_STATUS_URL, params)

    def create_child_record(self, source_type, source_id, dest_type, dest_data=None, delete_data=None):
        params = {
            'recordtype': source_type,
            'source_id': source_id,
            'dest_type': dest_type,
        }

        if dest_data:
            params['dest_data'] = dest_data
        if delete_data:
            params['delete_data'] = delete_data

        return self._post(self.TRANSFORM_URL, params)

    def get_child_record(self, source_type, source_id, dest_type):
        params = {
            'recordtype': source_type,
            'source_id': source_id,
            'dest_type': dest_type,
        }
        return self._get(self.TRANSFORM_URL, params)

    def delete_record(self, recordtype, entity_id):
        return self._delete(self.CRUD_URL, recordtype, entity_id)

    def get_record(self, **kwargs):
        return self._get(self.CRUD_URL, kwargs)

    def create_record(self, params):
        return self._post(self.CRUD_URL, params)

    def search_record(self, recordtype, filters, columns=[]):
        """
        recordtype: netsuite string of record type to search
        filters: list of filters, in the form:
            [
                ['firstname', 'startswith', 'Jean Luc'],
                'and',
                ['email', 'is', 'picard@example.com'],

                # ...etc...
            ]
        columns: list of columns to retrieve
        """
        params = {
            'recordtype': recordtype,
            'filters': json.dumps(filters),
            'columns': columns,
        }
        return self._get(self.SEARCH_URL, params)
