package eu.zavadil.wn.service;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.wn.data.banner.Banner;
import eu.zavadil.wn.data.banner.BannerRepository;
import eu.zavadil.wn.data.banner.BannerStub;
import eu.zavadil.wn.data.banner.BannerStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BannerService {

	@Autowired
	BannerRepository bannerRepository;

	@Autowired
	BannerStubRepository bannerStubRepository;

	@Transactional
	public BannerStub save(BannerStub stub) {
		return this.bannerStubRepository.save(stub);
	}

	public Page<Banner> search(String search, PageRequest pr) {
		return StringUtils.isBlank(search) ? this.bannerRepository.findAll(pr)
			: this.bannerRepository.search(search, pr);
	}

	public BannerStub loadById(int id) {
		return this.bannerStubRepository.findById(id).orElse(null);
	}

	public BannerStub requireById(int id) {
		return this.bannerStubRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("BannerStub", id));
	}

	public void deleteById(int id) {
		this.bannerStubRepository.deleteById(id);
	}

	public Page<Banner> loadByWebsiteId(int websiteId, PageRequest pr) {
		return this.bannerRepository.loadByWebsiteId(websiteId, pr);
	}

}
