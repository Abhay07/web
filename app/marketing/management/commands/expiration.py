'''
    Copyright (C) 2017 Gitcoin Core 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.

'''
from django.core.management.base import BaseCommand
from dashboard.models import Bounty
from django.utils import timezone
from marketing.mail import bounty_expire_warning


class Command(BaseCommand):

    help = 'the expiration notifications'

    def handle(self, *args, **options):
        days = [1, 3, 5, 10]
        for day in days:
            bounties = Bounty.objects.filter(
                is_open=True,
                expires_date__lt=(timezone.now() + timezone.timedelta(days=(day+1))),
                expires_date__gte=(timezone.now() + timezone.timedelta(days=day)),
            ).all()
            print('day {} got {} bounties'.format(day, bounties.count()))
            for b in bounties:
                email_list = []
                if b.bounty_owner_email:
                    email_list.append(b.bounty_owner_email)
                if b.claimee_email:
                    email_list.append(b.claimee_email)
                bounty_expire_warning(b, email_list)
