# Provider Accessibility Source-Pull Prep

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This prep artifact turns the provider accessibility gap into a concrete first-party pull queue for Florida, Texas, Pennsylvania, and Illinois. It pairs the current live provider rows with matching state source-target entries and extraction hints for truthful accessibility enrichment.

## florida

- trusted provider rows: 14
- live provider hosts: hopkinsallchildrens.org, fau.edu, fsucard.com, mdc.fsu.edu, nemours.org, nicklauschildrens.org, ucf-card.org, card.ufl.edu, hscj.ufl.edu, can.uflhealth.org, asac.psy.miami.edu, floridacard.org, card-usf.fmhi.usf.edu, icei.fmhi.usf.edu

Direct target matches from state source docs:

- Nicklaus Children's Hospital Dan Marino Center: https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center (static_fetch)

Hospital and clinic source targets to pull first:

- Nicklaus Children's Hospital Dan Marino Center: https://www.nicklauschildrens.org/locations/dan-marino-outpatient-center (static_fetch)
- UF Health Jacksonville Pediatric Development: https://ufhealthjax.org/pediatrics/developmental.aspx (static_fetch)
- UM Mailman Center for Child Development: https://med.miami.edu/centers-and-institutes/mailman-center (static_fetch)
- FLORIDA Specialized Clinic Roster #1: https://ahca.myflorida.com/specialized-roster-1 (static_fetch)
- FLORIDA Specialized Clinic Roster #2: https://ahca.myflorida.com/specialized-roster-2 (static_fetch)
- FLORIDA Specialized Clinic Roster #3: https://ahca.myflorida.com/specialized-roster-3 (static_fetch)

Roster sources to use only as secondary discovery support:

- FLORIDA Specialized Clinic Roster #1: https://ahca.myflorida.com/specialized-roster-1 (static_fetch)
- FLORIDA Specialized Clinic Roster #2: https://ahca.myflorida.com/specialized-roster-2 (static_fetch)
- FLORIDA Specialized Clinic Roster #3: https://ahca.myflorida.com/specialized-roster-3 (static_fetch)

Live provider rows and extraction hints:

- prov-all-childrens-hospital-fl: https://www.hopkinsallchildrens.org
  categories=developmental_clinic,diagnostic_center | next_step=call | host=hopkinsallchildrens.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- prov-fau-card-fl: https://www.fau.edu/education/centersandprograms/card/
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=fau.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-fsu-card-fl: https://fsucard.com
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=fsucard.com
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-fsu-mdc-fl: https://mdc.fsu.edu
  categories=developmental_clinic,diagnostic_center | next_step=email | host=mdc.fsu.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-nemours-childrens-health-fl: https://www.nemours.org
  categories=developmental_clinic,diagnostic_center | next_step=call | host=nemours.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- prov-nicklaus-childrens-brain-fl: https://www.nicklauschildrens.org
  categories=developmental_clinic,diagnostic_center | next_step=call | host=nicklauschildrens.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- prov-ucf-card-fl: https://ucf-card.org
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=ucf-card.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-uf-card-gainesville-fl: https://card.ufl.edu
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=card.ufl.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-uf-card-jacksonville-fl: https://hscj.ufl.edu/pediatrics/autism/
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=hscj.ufl.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-uf-health-can-fl: https://can.uflhealth.org/
  categories=developmental_clinic,diagnostic_center | next_step=email | host=can.uflhealth.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-um-asac-fl: https://asac.psy.miami.edu
  categories=developmental_clinic,diagnostic_center | next_step=email | host=asac.psy.miami.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-um-nsu-card-fl: https://www.floridacard.org
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=floridacard.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-usf-card-fl: https://card-usf.fmhi.usf.edu
  categories=developmental_clinic,card_center,diagnostic_center | next_step=email | host=card-usf.fmhi.usf.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- prov-usf-icei-fl: https://icei.fmhi.usf.edu
  categories=developmental_clinic,diagnostic_center | next_step=email | host=icei.fmhi.usf.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages

## texas

- trusted provider rows: 9
- live provider hosts: bcm.edu, childrens.com, cookchildrens.org, dellchildrens.net, texaschildrens.org, depts.ttu.edu, calliercenter.utdallas.edu, uth.edu, utsouthwestern.edu

Direct target matches from state source docs:

- Texas Children's Hospital Autism Center: https://www.texaschildrens.org/departments/autism-center (static_fetch)
- Cook Children's Child Development Center: https://www.cookchildrens.org/services/child-development/ (static_fetch)
- UT Dallas Callier Center for Communication Disorders: https://calliercenter.utdallas.edu (static_fetch)

Hospital and clinic source targets to pull first:

- Texas Children's Hospital Autism Center: https://www.texaschildrens.org/departments/autism-center (static_fetch)
- Cook Children's Child Development Center: https://www.cookchildrens.org/services/child-development/ (static_fetch)

Roster sources to use only as secondary discovery support:


Live provider rows and extraction hints:

- tx-clinic-bcm-meyer: https://www.bcm.edu
  categories=Clinical,Developmental | next_step=call | host=bcm.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-childrens-autism: https://www.childrens.com
  categories=Clinical,Autism | next_step=call | host=childrens.com
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-cook-developmental: https://www.cookchildrens.org/services/child-development/
  categories=Clinical,Therapy,Developmental | next_step=call | host=cookchildrens.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-dell-child-study: https://www.dellchildrens.net
  categories=Clinical,Therapy,Developmental | next_step=call | host=dellchildrens.net
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-tch-autism: https://www.texaschildrens.org/departments/autism-center
  categories=Clinical,Therapy,Autism | next_step=call | host=texaschildrens.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-ttuhsc-burkhart: https://www.depts.ttu.edu/burkhartcenter/
  categories=Clinical,Autism,Education | next_step=call | host=depts.ttu.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-utd-callier: https://calliercenter.utdallas.edu
  categories=Clinical,Therapy,Speech | next_step=call | host=calliercenter.utdallas.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; speech/communication clinics often publish teletherapy or interpreter details on intake or services pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-uth-autism: https://www.uth.edu
  categories=Clinical,Autism | next_step=call | host=uth.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- tx-clinic-utsw-cadd: https://www.utsouthwestern.edu
  categories=Clinical,Autism,Developmental | next_step=call | host=utsouthwestern.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages

## pennsylvania

- trusted provider rows: 7
- live provider hosts: chop.edu, geisinger.org, pennstatehealth.org, stchristophershospital.com, templehealth.org, chp.edu

Direct target matches from state source docs:

- Children's Hospital of Philadelphia (CHOP) Developmental Pediatrics: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics (static_fetch)

Hospital and clinic source targets to pull first:

- Children's Hospital of Philadelphia (CHOP) Developmental Pediatrics: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #1: https://www.dhs.pa.gov/specialized-roster-1 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #2: https://www.dhs.pa.gov/specialized-roster-2 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #3: https://www.dhs.pa.gov/specialized-roster-3 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #4: https://www.dhs.pa.gov/specialized-roster-4 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #5: https://www.dhs.pa.gov/specialized-roster-5 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #6: https://www.dhs.pa.gov/specialized-roster-6 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #7: https://www.dhs.pa.gov/specialized-roster-7 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #8: https://www.dhs.pa.gov/specialized-roster-8 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #9: https://www.dhs.pa.gov/specialized-roster-9 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #10: https://www.dhs.pa.gov/specialized-roster-10 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #11: https://www.dhs.pa.gov/specialized-roster-11 (static_fetch)

Roster sources to use only as secondary discovery support:

- PENNSYLVANIA Specialized Clinic Roster #1: https://www.dhs.pa.gov/specialized-roster-1 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #2: https://www.dhs.pa.gov/specialized-roster-2 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #3: https://www.dhs.pa.gov/specialized-roster-3 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #4: https://www.dhs.pa.gov/specialized-roster-4 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #5: https://www.dhs.pa.gov/specialized-roster-5 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #6: https://www.dhs.pa.gov/specialized-roster-6 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #7: https://www.dhs.pa.gov/specialized-roster-7 (static_fetch)
- PENNSYLVANIA Specialized Clinic Roster #8: https://www.dhs.pa.gov/specialized-roster-8 (static_fetch)

Live provider rows and extraction hints:

- pa-clinic-chop: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=chop.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-chop-kop: https://www.chop.edu/locations/chop-care-center-king-prussia
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=chop.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-geisinger: https://www.geisinger.org/patient-care/specialties-and-services/autism-and-developmental-medicine-institute
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=geisinger.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-psu: https://www.pennstatehealth.org/services-treatments/developmental-pediatrics
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=pennstatehealth.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-st-christophers: https://www.stchristophershospital.com/services/developmental-pediatrics
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=stchristophershospital.com
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-temple: https://www.templehealth.org
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=templehealth.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages
- pa-clinic-upmc: https://www.chp.edu/our-services/developmental-pediatrics
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=call | host=chp.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; call-first providers often surface interpreter or patient-access phone guidance near scheduling or appointment pages

## illinois

- trusted provider rows: 6
- live provider hosts: carle.org, thehopeclinic.org, luriechildrens.org, osfhealthcare.org, rush.edu, ahs.uic.edu

Direct target matches from state source docs:

- Ann & Robert H. Lurie Children's Hospital Developmental Pediatrics: https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics/ (static_fetch)

Hospital and clinic source targets to pull first:

- Ann & Robert H. Lurie Children's Hospital Developmental Pediatrics: https://www.luriechildrens.org/en/specialties-conditions/developmental-behavioral-pediatrics/ (static_fetch)
- ILLINOIS Specialized Clinic Roster #1: https://hfs.illinois.gov/specialized-roster-1 (static_fetch)
- ILLINOIS Specialized Clinic Roster #2: https://hfs.illinois.gov/specialized-roster-2 (static_fetch)
- ILLINOIS Specialized Clinic Roster #3: https://hfs.illinois.gov/specialized-roster-3 (static_fetch)
- ILLINOIS Specialized Clinic Roster #4: https://hfs.illinois.gov/specialized-roster-4 (static_fetch)
- ILLINOIS Specialized Clinic Roster #5: https://hfs.illinois.gov/specialized-roster-5 (static_fetch)
- ILLINOIS Specialized Clinic Roster #6: https://hfs.illinois.gov/specialized-roster-6 (static_fetch)
- ILLINOIS Specialized Clinic Roster #7: https://hfs.illinois.gov/specialized-roster-7 (static_fetch)
- ILLINOIS Specialized Clinic Roster #8: https://hfs.illinois.gov/specialized-roster-8 (static_fetch)
- ILLINOIS Specialized Clinic Roster #9: https://hfs.illinois.gov/specialized-roster-9 (static_fetch)
- ILLINOIS Specialized Clinic Roster #10: https://hfs.illinois.gov/specialized-roster-10 (static_fetch)
- ILLINOIS Specialized Clinic Roster #11: https://hfs.illinois.gov/specialized-roster-11 (static_fetch)

Roster sources to use only as secondary discovery support:

- ILLINOIS Specialized Clinic Roster #1: https://hfs.illinois.gov/specialized-roster-1 (static_fetch)
- ILLINOIS Specialized Clinic Roster #2: https://hfs.illinois.gov/specialized-roster-2 (static_fetch)
- ILLINOIS Specialized Clinic Roster #3: https://hfs.illinois.gov/specialized-roster-3 (static_fetch)
- ILLINOIS Specialized Clinic Roster #4: https://hfs.illinois.gov/specialized-roster-4 (static_fetch)
- ILLINOIS Specialized Clinic Roster #5: https://hfs.illinois.gov/specialized-roster-5 (static_fetch)
- ILLINOIS Specialized Clinic Roster #6: https://hfs.illinois.gov/specialized-roster-6 (static_fetch)
- ILLINOIS Specialized Clinic Roster #7: https://hfs.illinois.gov/specialized-roster-7 (static_fetch)
- ILLINOIS Specialized Clinic Roster #8: https://hfs.illinois.gov/specialized-roster-8 (static_fetch)

Live provider rows and extraction hints:

- clinic-carle-dev-peds-il: https://www.carle.org
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=carle.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- clinic-hope-chicago-il: https://www.thehopeclinic.org
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=thehopeclinic.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- clinic-lurie-childrens-il: https://www.luriechildrens.org
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=luriechildrens.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- clinic-osf-peoria-il: https://www.osfhealthcare.org
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=osfhealthcare.org
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- clinic-rush-aarts-il: https://www.rush.edu
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=rush.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
- clinic-uic-family-il: https://www.ahs.uic.edu
  categories=developmental_pediatrics,autism_clinic,card_center | next_step=email | host=ahs.uic.edu
  hints=look for explicit languages, interpreter, ASL, telehealth, virtual visit, transportation, or accessibility wording on the first-party page ; check contact, patient-services, appointment, FAQ, and accessibility sections before considering deeper crawl expansion ; autism center pages often expose telehealth, family support, and multilingual intake details on program overview or contact pages ; developmental pediatrics pages often expose referral requirements, interpreter access, and scheduling instructions on patient pages ; email-first providers are good candidates for language/contact-form accessibility cues on their contact pages
